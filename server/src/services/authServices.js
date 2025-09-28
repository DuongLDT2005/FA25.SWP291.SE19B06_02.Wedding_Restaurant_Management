import bcrypt from "bcryptjs";
import UserDAO from "../dao/userDao.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
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
            throw new Error('User data cannot be null');
        }
        if (userData.password) {
            userData.password = await hashPassword(userData.password);
        }
        
        const newCustomer = await UserDAO.createCustomer(userData);
        return newCustomer;
        }
    
    static async signUpOwner(userData) {
        if (!userData) {
            throw new Error('User data cannot be null');
        }
        if (userData.password) {
            userData.password = await hashPassword(userData.password);
        }
        const newOwner = await UserDAO.createOwner(userData);
        return newOwner;
    }

  static async loginWithEmail(email, password) {
    const user = await UserDAO.findByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }
    // Generate JWT token
    const token = jwt.sign(
        { userId: user.userId, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h", algorithm: "HS256" }
    );
    return { user, token };
}
  static async resetPassword(userId, newPassword) {
    const hashedPassword = await hashPassword(newPassword);
    await UserDAO.updateUserInfo(userId, { password: hashedPassword });
  }
  static async forgotPassword(email) {
    const user = await UserDAO.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    // Generate a one-time password (OTP)
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Save the OTP and its expiration time in the database (or cache)
    const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await Otp.create({ userId: user.userId, otp, otpExpiration });

    // Send the OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };
    // 
    await transporter.sendMail(mailOptions);
  }
  static async logout(req, res) {
    // Since JWT tokens are stateless, you can implement a blacklist to invalidate tokens.
    // Example: Add the token to a blacklist in your database or cache with an expiration time.

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Token not provided");
    }


    res.status(200).json({ message: "Logged out successfully" });
  }
  // static async verifyOtp(userId, otpInput) {
  //     // Find OTP record for user
  //     const otpRecord = await Otp.findOne({ userId });
  //     if (!otpRecord) {
  //         throw new Error("OTP not found");
  //     }
  //     // Check OTP match
  //     if (otpRecord.otp !== otpInput) {
  //         throw new Error("Invalid OTP");
  //     }
  //     // Check expiration
  //     if (Date.now() > otpRecord.otpExpiration) {
  //         throw new Error("OTP expired");
  //     }
  //     // OTP is valid
  //     // Optionally, delete the OTP record after successful verification
  //     await Otp.deleteOne({ userId });
  //     return true;
  // }
  
}

export default AuthServices;