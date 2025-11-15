import AuthServices from "../services/AuthServices.js";
import UserService from "../services/userServices.js";
import axios from "axios";
import jwt from "jsonwebtoken";
class AuthController {
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

  static async googlePopupLogin(req, res) {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Thiếu code" });

    console.log("Received Google code:", code);

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "postmessage",
      grant_type: "authorization_code",
    });

    const { access_token, id_token } = tokenRes.data;
    console.log("Google token exchange success:", tokenRes.data);

    // Lấy thông tin user
    const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const { email, name, picture } = userInfo.data;

    console.log("Google user info:", userInfo.data);

    // Tìm hoặc tạo user
    const user = await AuthServices.findOrCreateGoogleUser({
      email,
      fullName: name,
      avatarURL: picture,
    });

    const token = jwt.sign(
      { userID: user.userID, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 2 * 60 * 60 * 1000,
    };
    res.cookie('token', token, cookieOptions);
    res.json({ message: "Đăng nhập Google thành công", user });
  } catch (err) {
    console.error("Google Sign-In Error:", err.response?.data || err.message);
    res.status(500).json({
      message: "Đăng nhập Google thất bại",
      error: err.response?.data || err.message,
    });
  }
}


  static async logout(req, res) {
    try {
      await AuthServices.logout(req);
      // Clear cookie
      res.clearCookie('token', { httpOnly: true, sameSite: 'Lax' });
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async forgotPassword(req, res) {
    try {
      console.log("📩 [ForgotPassword] Body nhận được:", req.body); // 👈 để debug
      console.log("📩 Content-Type:", req.headers["content-type"]);

      if (!req.body || !req.body.email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const { email } = req.body;
      await AuthServices.forgotPassword(email);

      res.json({ message: "OTP email sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
  static async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }
      await AuthServices.verifyOtp(email, otp);
      // Generate temporary token for password reset (valid 10 min)
      const tempToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });
      res.status(200).json({ message: "OTP verified successfully", tempToken });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(400).json({ error: error.message });
    }
  }
  static async resetPassword(req, res) {
    try {
      const { email, newPassword, tempToken } = req.body;
      if (!email || !newPassword || !tempToken) {
        return res.status(400).json({
          error: "Email, new password, and temporary token are required",
        });
      }
      const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      if (decoded.email !== email) {
        return res
          .status(400)
          .json({ error: "Invalid token for the provided email" });
      }
      await AuthServices.resetPassword(email, newPassword);
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async signupCustomer(req, res) {
    try {
      const customerData = req.body;
      if (!customerData) {
        return res.status(400).json({ error: "Request body cannot be null" });
      }
      const newCustomer = await AuthServices.signUpCustomer(customerData);
      res.status(201).json({
        message: "Customer created",
        user: newCustomer || null,
      });
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }

  static async signupOwner(req, res) {
    try {
      const newOwner = await AuthServices.signUpOwner(req.body);
      return res.status(201).json({ message: "Owner created", user: newOwner });
    } catch (err) {
      console.error("Signup owner error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }
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
}
export default AuthController;
