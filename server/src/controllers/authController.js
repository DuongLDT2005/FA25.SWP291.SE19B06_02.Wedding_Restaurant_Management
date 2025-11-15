import AuthServices from "../services/AuthServices.js";
import axios from "axios";
import jwt from "jsonwebtoken";

import db from "../config/db.js";
const { user: User } = db;

class AuthController {
  /* ===========================================
      LOGIN NORMAL
  =========================================== */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ error: "Email and password are required" });

      const { user, token } = await AuthServices.loginWithEmail(email, password);

      return res.json({ success: true, user, token });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || "Login failed",
      });
    }
  }

  /* ===========================================
      GOOGLE LOGIN
  =========================================== */
  static async googleLogin(req, res) {
    try {
      const { code } = req.body;
      if (!code)
        return res.status(400).json({ error: "Google code is required" });

      // 1️⃣ Đổi code sang tokens
      const tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: "postmessage",
          grant_type: "authorization_code",
        }
      );

      const { id_token, access_token } = tokenRes.data;

      // 2️⃣ Lấy thông tin user từ Google
      const googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const { email, name, picture } = googleUser.data;

      if (!email)
        return res.status(400).json({ error: "Google user has no email" });

      // 3️⃣ Kiểm tra user đã tồn tại chưa
      let user = await User.findOne({ where: { email } });

      if (!user) {
        // Nếu user chưa tồn tại → tạo mới
        user = await User.create({
          email,
          fullName: name,
          avatarURL: picture,
          role: "CUSTOMER",
          status: "ACTIVE",
          password: "", // Google Login không dùng password
        });
      } else {
        // Nếu user đã có → cập nhật avatar nếu thay đổi
        if (picture && user.avatarURL !== picture) {
          await user.update({ avatarURL: picture }); // FIX: user là instance Sequelize
        }
      }

      // 4️⃣ Tạo token JWT
      const token = jwt.sign(
        {
          userID: user.userID,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        user,
        token,
      });
    } catch (err) {
      console.error("Google login error:", err.message);
      return res.status(500).json({
        success: false,
        error: err.message || "Google Login failed",
      });
    }
  }

  /* ===========================================
      LOGOUT (BLACKLIST TOKEN)
  =========================================== */
  static async logout(req, res) {
    try {
      await AuthServices.logout(req);
      return res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /* ===========================================
      FORGOT PASSWORD (SEND OTP)
  =========================================== */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      await AuthServices.forgotPassword(email);

      return res.json({ message: "OTP email sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  /* ===========================================
      VERIFY OTP
  =========================================== */
  static async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      await AuthServices.verifyOtp(email, otp);

      const tempToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });

      return res.json({ message: "OTP verified", tempToken });
    } catch (error) {
      console.error("Verify OTP error:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  /* ===========================================
      RESET PASSWORD
  =========================================== */
  static async resetPassword(req, res) {
    try {
      const { email, newPassword, tempToken } = req.body;

      const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      if (decoded.email !== email)
        return res.status(400).json({ error: "Invalid token" });

      await AuthServices.resetPassword(email, newPassword);

      return res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  /* ===========================================
      SIGN UP CUSTOMER
  =========================================== */
  static async signupCustomer(req, res) {
    try {
      const user = await AuthServices.signUpCustomer(req.body);

      return res.status(201).json({
        message: "Customer created",
        user,
      });
    } catch (error) {
      console.error("Signup customer error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  /* ===========================================
      SIGN UP OWNER (WITH FILE)
  =========================================== */
  static async signupOwner(req, res) {
    try {
      const data = await AuthServices.signUpOwner(req.body, req.file);

      return res.status(201).json(data);
    } catch (error) {
      console.error("Signup owner error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  /* ===========================================
      GET CURRENT USER
  =========================================== */
  static async getCurrentUser(req, res) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    return res.json({ user: req.user });
  }

  static async approveOwner(req, res) {
    try {
      const { id } = req.params;
      const result = await AuthServices.approveOwner(id);

      return res.json(result);
    } catch (error) {
      console.error("Approve owner error:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  static async activateOwner(req, res) {
    try {
      const { id } = req.params;
      const result = await AuthServices.activateOwner(id);

      return res.json(result);
    } catch (error) {
      console.error("Activate owner error:", error);
      return res.status(400).json({ error: error.message });
    }
  }
  static async getNegotiatingPartners(req, res) {
    try {
      const list = await UserService.getNegotiatingPartners();
      res.json({ success: true, data: list });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export default AuthController;
