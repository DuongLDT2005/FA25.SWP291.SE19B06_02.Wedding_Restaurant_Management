import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";

import UserDAO from "../dao/userDao.js";
import db from "../config/db.js";

import { negoStatus, userRole, userStatus } from "../models/enums/UserStatus.js";
import { deleteOtpByEmail, getOtpByEmail, insertOtp } from "../dao/mongoDAO.js";

dotenv.config();

const RestaurantPartnerModel = db.restaurantpartner;
const JWT_SECRET = process.env.JWT_SECRET;

/* Helper */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

class AuthServices {
  /* ============================================
      SIGN UP CUSTOMER
  ============================================ */
  static async signUpCustomer(userData) {
    if (!userData) {
      throw new Error("User data cannot be null");
    }
    // Check if email already exists
    const existing = await UserDAO.findByEmail(userData.email);
    if (existing) {
      throw new Error("Email đã tồn tại");
    }
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }

    return await UserDAO.createCustomer(userData);
  }

  /* ============================================
      SIGN UP PARTNER (OWNER)
  ============================================ */
  static async signUpOwner(userData, file) {
    if (!file) throw new Error("License file is required");

    const { name, email, phone, password } = userData;

    // 1) Upload giấy phép lên cloud (PDF hoặc image)
    // Detect file type để dùng resource_type đúng
    const fileExtension = file.originalname?.toLowerCase().split('.').pop() || '';
    const isPdf = fileExtension === 'pdf' || file.mimetype === 'application/pdf';
    
    const uploadOptions = {
      folder: "partner-licenses",
    };
    
    // Force dùng 'raw' cho PDF, 'image' cho ảnh
    if (isPdf) {
      uploadOptions.resource_type = "raw";
    } else {
      uploadOptions.resource_type = "image";
    }

    console.log("📤 Uploading license file:", {
      filename: file.originalname,
      mimetype: file.mimetype,
      extension: fileExtension,
      resource_type: uploadOptions.resource_type
    });

    // Với raw files, cần giữ extension trong public_id để Cloudinary nhận diện đúng file type
    // QUAN TRỌNG: Cloudinary yêu cầu public_id phải có extension .pdf cho raw PDF files
    if (isPdf) {
      uploadOptions.use_filename = false;
      uploadOptions.unique_filename = true;
      uploadOptions.overwrite = false;
      // Tạo public_id CÓ extension .pdf (bắt buộc cho raw PDF files)
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      uploadOptions.public_id = `partner-licenses/${timestamp}_${randomStr}.pdf`;
      
      console.log("📝 Setting public_id with .pdf extension:", uploadOptions.public_id);
    }

    const uploaded = await cloudinary.uploader.upload(file.path, uploadOptions);

    console.log("✅ Uploaded to Cloudinary:", {
      secure_url: uploaded.secure_url,
      resource_type: uploaded.resource_type,
      format: uploaded.format,
      public_id: uploaded.public_id,
      url: uploaded.url,
      bytes: uploaded.bytes,
      created_at: uploaded.created_at
    });

    // Verify file exists in Cloudinary
    try {
      const resource = await cloudinary.api.resource(uploaded.public_id, {
        resource_type: 'raw'
      });
      console.log("✅ Verified file exists in Cloudinary:", {
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        bytes: resource.bytes
      });
    } catch (verifyErr) {
      console.error("❌ File verification failed:", verifyErr.message);
      throw new Error(`File uploaded but verification failed: ${verifyErr.message}`);
    }

    // Đảm bảo URL đúng format - dùng URL từ Cloudinary response
    // QUAN TRỌNG: Giữ nguyên URL gốc từ Cloudinary, KHÔNG convert
    // Cloudinary có thể lưu PDF như image hoặc raw, URL từ Cloudinary đã đúng
    let finalUrl = uploaded.secure_url || uploaded.url;
    
    // KHÔNG convert URL vì Cloudinary đã trả về URL đúng format
    // Nếu Cloudinary trả về /image/upload/, đó là URL đúng cho file đó
    // Nếu Cloudinary trả về /raw/upload/, đó cũng là URL đúng
    console.log("ℹ️ Using original Cloudinary URL (no conversion):", finalUrl);
    console.log("ℹ️ Resource type from Cloudinary:", uploaded.resource_type);
    
    console.log("🎯 Final URL to save:", finalUrl);
    console.log("🔍 URL breakdown:", {
      hasRawUpload: finalUrl.includes('/raw/upload/'),
      hasPdf: finalUrl.includes('.pdf'),
      endsWithPdf: finalUrl.endsWith('.pdf'),
      publicIdInUrl: finalUrl.match(/partner-licenses\/[^\/]+/)?.[0],
      fullUrl: finalUrl
    });
    
    // Test URL bằng cách tạo signed URL (nếu cần)
    // const signedUrl = cloudinary.utils.private_download_url(uploaded.public_id, {
    //   resource_type: 'raw',
    //   type: 'upload',
    //   expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    // });
    // console.log("🔐 Signed URL (if needed):", signedUrl);

    // 2) Hash password
    const hashedPassword = await hashPassword(password);

    // 3) Tạo user + partner (status = pending)
    await UserDAO.createOwner({
      fullName: name,
      email,
      phone,
      password: hashedPassword,
      licenseUrl: finalUrl,
    });

    // ⭐ Chỉ trả về message → FE không login user
    return {
      message: "Registration submitted. Please wait for admin approval.",
      status: "pending",
    };
  }

  /* ============================================
      LOGIN WITH EMAIL + PASSWORD
  ============================================ */
  static async loginWithEmail(email, password) {
    const user = await UserDAO.findByEmail(email, true);
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid password");

    // ⭐ Check user status (inactive users cannot login)
    if (user.status === userStatus.inactive || user.status === 0 || user.status === false) {
      throw new Error("Your account is inactive. Please contact admin.");
    }

    // ⭐ Check owner approval
    let partnerStatus = null;
    if (user.role === userRole.owner) {
      const partner = await RestaurantPartnerModel.findByPk(user.userID);

      if (!partner) throw new Error("Partner profile not found");

      if (partner.status === negoStatus.pending)
        throw new Error("Your account is pending admin approval.");

      if (partner.status === negoStatus.rejected)
        throw new Error("Your registration was rejected by admin.");

      // Store partner status for frontend redirect logic
      partnerStatus = partner.status;
    }

    const token = jwt.sign(
      { sub: user.userID, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { user, token, partnerStatus };
  }

  /* ============================================
      GOOGLE LOGIN
  ============================================ */
  static async findOrCreateGoogleUser(info) {
    const { email, name, picture } = info;

    let user = await UserDAO.findByEmail(email);

    if (user) {
      await user.update({
        avatarURL: user.avatarURL ?? picture,
        fullName: user.fullName ?? name,
      });
    } else {
      user = await UserDAO.createCustomer({
        email,
        fullName: name,
        avatarURL: picture,
        password: null,
        phone: null,
        role: 0,
        status: 1,
        loginProvider: "GOOGLE",
      });
    }

    const token = jwt.sign(
      {
        userID: user.userID,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    return { user, token };
  }

  static async loginWithEmail(email, password) {
    const user = await UserDAO.findByEmail(email, true);
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    // Generate JWT token
  // Include both userId and sub for compatibility; source uses userID (capital D)
  const userId = user.userID ?? user.userId ?? user.id;
  const token = jwt.sign(
    { sub: userId, userId: userId, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h", algorithm: "HS256" }
  );
    return { user, token };
  }

  /* ============================================
      FORGOT PASSWORD (SEND OTP)
  ============================================ */
  static async forgotPassword(email) {
    const user = await UserDAO.findByEmail(email, true);
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000);
    insertOtp(email, otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP is ${otp}. It expires soon.`,
    });
  }
  static async logout(req) {
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader?.startsWith('Bearer ')) token = authHeader.split(' ')[1];
    if (!token && req.cookies?.token) token = req.cookies.token;

    // Optional temp reset token (JWT 10m) sent in body or header or cookie
    const tempToken = req.body?.tempToken || req.cookies?.tempToken || null;
    // Optional raw OTP code if client wants to explicitly invalidate it early
    const otpCode = req.body?.otp || null;

    const { getCollection } = await import("../dao/mongoDAO.js");
    const blacklist = getCollection("blacklist");

    const now = Date.now();
    const docs = [];
    if (token) {
      docs.push({ token, type: 'access', expiresAt: new Date(now + 60 * 60 * 1000) });
    }
    if (tempToken) {
      // Temp token already short-lived; still blacklist to force immediate invalidation
      docs.push({ token: tempToken, type: 'temp', expiresAt: new Date(now + 10 * 60 * 1000) });
    }
    if (otpCode) {
      // Mark OTP used/invalid — shorter TTL (5m) just for safety window
      docs.push({ otp: String(otpCode), type: 'otp', expiresAt: new Date(now + 5 * 60 * 1000) });
      // Also remove OTP document if still exists so it can't be verified
      try { await deleteOtpByEmail(req.body?.email); } catch (_) {}
    }
    if (docs.length > 0) {
      await blacklist.insertMany(docs);
    }
    return true;
  }
  static async verifyOtp(email, otpInput) {
    // Block if OTP is blacklisted
    try {
      const { getCollection } = await import("../dao/mongoDAO.js");
      const blacklist = getCollection("blacklist");
      const blocked = await blacklist.findOne({ otp: String(otpInput) });
      if (blocked) throw new Error("OTP has been invalidated");
    } catch (_) {}
    // Find OTP record for user
    const otp = await getOtpByEmail(email);
    if (!otp) {
      throw new Error("OTP not found or expired");
    }
    if (otp.otp != otpInput) {
      console.log(otpInput, otp.otp);
      throw new Error("Invalid OTP");
    }
    console.log("OTP verified successfully");
    deleteOtpByEmail(email);
    return true;
  }

  static async approveOwner(userID) {
    const partner = await RestaurantPartnerModel.findByPk(userID);
    if (!partner) throw new Error("Partner not found");

    if (partner.status !== negoStatus.pending)
      throw new Error("This partner is not pending approval");

    await partner.update({ status: negoStatus.negotiating });

    return { message: "Owner approved and moved to negotiation stage." };
  }

  static async activateOwner(userID) {
    const partner = await RestaurantPartnerModel.findByPk(userID);
    if (!partner) throw new Error("Partner not found");

    await partner.update({ status: negoStatus.active });
    // ✔ user → active (cho phép login)
    await db.user.update({ status: 1 }, { where: { userID } });
    return { message: "Owner is now active." };
  }
}

export default AuthServices;
