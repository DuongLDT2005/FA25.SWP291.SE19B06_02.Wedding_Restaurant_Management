import bcrypt from "bcryptjs";
import UserDAO from "../dao/userDao.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { deleteOtpByEmail, getOtpByEmail, insertOtp } from "../dao/mongoDAO.js";
// import Otp from "../dao/mongoDAO.js";

dotenv.config();

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

const JWT_SECRET = process.env.JWT_SECRET;
class AuthServices {
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

    const newCustomer = await UserDAO.createCustomer(userData);
    return newCustomer;
  }

  static async signUpOwner(userData) {
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
    const newOwner = await UserDAO.createOwner(userData);
    return newOwner;
  }

  static async findOrCreateGoogleUser(googleUser) {
    const { email, name, picture } = googleUser;

    // 1️⃣ Kiểm tra xem email đã có trong hệ thống chưa
    let user = await UserDAO.findByEmail(email);

    if (user) {
      // 2️⃣ Nếu đã có, chỉ cập nhật thêm thông tin từ Google (nếu thiếu)
      const updatedFields = {};
      if (!user.avatarURL && picture) updatedFields.avatarURL = picture;
      if (!user.fullName && name) updatedFields.fullName = name;

      if (Object.keys(updatedFields).length > 0) {
        await user.update(updatedFields);
      }

      console.log(`✅ Found existing user: ${email} → login directly`);
    } else {
      // 3️⃣ Nếu chưa có, tạo tài khoản mới (không cần password)
      console.log(`🆕 Creating new Google user: ${email}`);
      user = await UserDAO.createCustomer({
        email,
        fullName: name,
        avatarURL: picture,
        password: null,
        phone: null,
        role: "CUSTOMER",
        status: "ACTIVE",
        loginProvider: "GOOGLE", // 👈 thêm trường này để phân biệt
      });
    }

    // 4️⃣ Trả về JWT cho cả 2 trường hợp
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
  static async resetPassword(email, newPassword) {
    const hashedPassword = await hashPassword(newPassword);
    const user = await UserDAO.findByEmail(email, true);
    if (!user) throw new Error("User not found");
    await UserDAO.updateUserInfo(user.userID, { password: hashedPassword });
  }
  static async forgotPassword(email) {
    const user = await UserDAO.findByEmail(email, true);
    if (!user) {
      throw new Error("User not found");
    }
    // Generate a one-time password (OTP)
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    insertOtp(email, otp);
    // Send the OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It will expire automatically.`,
    };
    //
    await transporter.sendMail(mailOptions);
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
}
export default AuthServices;
