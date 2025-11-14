import AuthServices from "../services/AuthServices.js";
import axios from "axios";
import jwt from "jsonwebtoken";

class AuthController {

  /* ===========================================
      LOGIN NORMAL
  =========================================== */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthServices.loginWithEmail(email, password);

      user.password = undefined;
      return res.json({ user, token });

    } catch (error) {
      console.error("Login error:", error);
      return res.status(401).json({ error: error.message });
    }
  }

  /* ===========================================
      GOOGLE LOGIN
  =========================================== */
  static async googlePopupLogin(req, res) {
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ message: "Missing code" });

      // 1) Đổi code lấy access_token
      const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "postmessage",
        grant_type: "authorization_code",
      });

      const { access_token } = tokenRes.data;

      // 2) Lấy user profile từ Google
      const { data: profile } = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const { user, token } = await AuthServices.findOrCreateGoogleUser({
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      });

      return res.json({ user, token });
    } catch (error) {
      console.error("Google login error:", error);
      return res.status(500).json({ error: "Google login failed" });
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
    if (!req.user)
      return res.status(401).json({ error: "Unauthorized" });

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

}

export default AuthController;
