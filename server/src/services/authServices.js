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
  static async logout(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Token not provided");
    }
    // Thêm token vào blacklist trên MongoDB
    const { getCollection } = await import("../dao/mongoDAO.js");
    const blacklist = getCollection("blacklist");
    // Lưu token với thời gian hết hạn (ví dụ: 1 giờ)
    await blacklist.insertOne({
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
    res.status(200).json({ message: "Logged out successfully" });
  }
  static async verifyOtp(email, otpInput) {
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
