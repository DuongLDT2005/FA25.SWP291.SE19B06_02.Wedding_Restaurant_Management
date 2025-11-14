import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";

import UserDAO from "../dao/userDao.js";
import db from "../config/db.js";

import { negoStatus, userRole } from "../models/enums/UserStatus.js";
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
    if (!userData) throw new Error("User data cannot be null");

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

    // 1) Upload giấy phép lên cloud
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "partner-licenses",
    });

    // 2) Hash password
    const hashedPassword = await hashPassword(password);

    // 3) Tạo user + partner (status = pending)
    await UserDAO.createOwner({
      fullName: name,
      email,
      phone,
      password: hashedPassword,
      licenseUrl: uploaded.secure_url,
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

    // ⭐ Check owner approval
    if (user.role === userRole.owner) {
      const partner = await RestaurantPartnerModel.findByPk(user.userID);

      if (!partner) throw new Error("Partner profile not found");

      if (partner.status === negoStatus.pending)
        throw new Error("Your account is pending admin approval.");

      if (partner.status === negoStatus.rejected)
        throw new Error("Your registration was rejected by admin.");
    }

    const token = jwt.sign(
      { sub: user.userID, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { user, token };
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
      { userID: user.userID, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
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

  /* ============================================
      VERIFY OTP
  ============================================ */
  static async verifyOtp(email, otpInput) {
    const otp = await getOtpByEmail(email);
    if (!otp) throw new Error("OTP not found or expired");
    if (otp.otp != otpInput) throw new Error("Invalid OTP");

    deleteOtpByEmail(email);
    return true;
  }

  /* ============================================
      RESET PASSWORD
  ============================================ */
  static async resetPassword(email, newPassword) {
    const user = await UserDAO.findByEmail(email, true);
    if (!user) throw new Error("User not found");

    const hashed = await hashPassword(newPassword);
    await UserDAO.updateUserInfo(user.userID, { password: hashed });
  }

  /* ============================================
      LOGOUT (BLACKLIST TOKEN)
  ============================================ */
  static async logout(req) {
    const bearer = req.headers.authorization;
    if (!bearer) throw new Error("Token missing");

    const token = bearer.split(" ")[1];

    const { getCollection } = await import("../dao/mongoDAO.js");
    const blacklist = getCollection("blacklist");

    await blacklist.insertOne({
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

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

    return { message: "Owner is now active." };
  }
}

export default AuthServices;
