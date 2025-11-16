import AuthServices from "../services/AuthServices.js";
import UserService from "../services/userServices.js";
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
      const { email, password, tempToken } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      let user, token;

      if (tempToken) {
        // Login with temp token (after OTP verification)
        console.log("Login with tempToken for email:", email);
        try {
          const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
          console.log("Decoded tempToken:", decoded);
          if (decoded.email !== email) {
            console.log("Email mismatch:", decoded.email, "vs", email);
            return res.status(400).json({ error: "Invalid temp token for this email" });
          }
        } catch (jwtError) {
          console.log("JWT verification failed:", jwtError.message);
          return res.status(401).json({ error: "Invalid or expired temp token" });
        }
        
        // Find user
        const userRecord = await UserService.findByEmail(email);
        console.log("User found:", userRecord ? { id: userRecord.userID, email: userRecord.email, role: userRecord.role } : "null");
        if (!userRecord) {
          return res.status(404).json({ error: "User not found" });
        }
        
        user = userRecord;
        console.log("Creating token for user with role:", user.role);
        // Generate new JWT token
        token = jwt.sign(
          { userID: user.userID, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );
        console.log("New token generated for user:", user.email);
      } else {
        // Normal login with password
        if (!password) {
          return res.status(400).json({ error: "Password is required" });
        }
        
        const result = await AuthServices.loginWithEmail(email, password);
        user = result.user;
        token = result.token;
      }

      // Set HttpOnly cookie for JWT
      const cookieOptions = {
        httpOnly: true,
        secure: false, // Allow in development
        sameSite: 'Lax', // Changed from 'None' to 'Lax' for better compatibility
        maxAge: 60 * 60 * 1000, // 1h
      };
      console.log("Setting cookie with options:", cookieOptions);
      res.cookie('token', token, cookieOptions);
      console.log("Cookie set, sending response with user:", { userId: user.userID, email: user.email, role: user.role });
      
      // Return token in header and response for OTP login
      res.setHeader('Authorization', `Bearer ${token}`);
      res.json({ user, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ error: error.message || "Invalid email or password" });
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
      // Clear cookie
      res.clearCookie('token', { httpOnly: true, sameSite: 'Lax' });
      res.json({ message: "Logged out successfully" });
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
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.user.userId || req.user.userID || req.user.sub;
      if (!id) return res.status(400).json({ error: "Invalid token payload" });
      // Return full user profile with associations (restaurantpartner/customer)
      const fullUser = await UserService.getUserById(id);
      if (!fullUser) return res.status(404).json({ error: "User not found" });
      // Hide sensitive
      if (fullUser.password) delete fullUser.password;
      res.json({ user: fullUser });
    } catch (err) {
      console.error("getCurrentUser error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
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
