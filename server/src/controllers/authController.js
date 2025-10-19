import AuthServices from "../services/AuthServices.js";
import jwt from "jsonwebtoken";
class AuthController {
   static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            const { user, token } = await AuthServices.loginWithEmail(email, password);
            // Remove password before sending user data
            user.password = undefined;
            // send user data and token
            res.json({ user, token });


        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({ error: 'Invalid email or password' });
        }
   }
   static async logout(req, res) {
        try {
            // Invalidate the token (implementation depends on how you manage tokens)
            await AuthServices.logout(req);
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
   static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }
            await AuthServices.forgotPassword(email);
            //take otp from server then send email to user
            res.json({ message: 'otp email sent' });
            
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
   }
   static async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ error: 'Email and OTP are required' });
            }
            await AuthServices.verifyOtp(email, otp);
                // Generate temporary token for password reset (valid 10 min)
                const tempToken = jwt.sign(
                    { email },
                    process.env.JWT_SECRET,
                    { expiresIn: "10m" }
                );
                res.status(200).json({ message: "OTP verified successfully", tempToken });
        } catch (error) {
            console.error('Verify OTP error:', error);
            res.status(400).json({ error: error.message });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { email, newPassword, tempToken } = req.body;
            if (!email || !newPassword || !tempToken) {
                return res.status(400).json({ error: 'Email, new password, and temporary token are required' });
            }
            const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
            if (decoded.email !== email) {
                return res.status(400).json({ error: 'Invalid token for the provided email' });
            }
            await AuthServices.resetPassword(email, newPassword);
            res.json({ message: 'Password reset successfully' });
        }
        catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
   static async signupOwner(req, res) {
        try {
            const ownerData = req.body;
            if (!ownerData) {
                return res.status(400).json({ error: 'Request body cannot be null' });
            }
            const newOwner = await AuthServices.signUpOwner(ownerData);
            res.status(201).json(newOwner);
        } catch (error) {
            console.error('Error creating owner:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async signupCustomer(req, res) {
        try {
            const customerData = req.body;
            if (!customerData) {
                return res.status(400).json({ error: 'Request body cannot be null' });
            }
            const newCustomer = await AuthServices.signUpCustomer(customerData);
            res.status(201).json(newCustomer);
        } catch (error) {
            console.error('Error creating customer:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async getCurrentUser(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ user: req.user });
}
}
export default AuthController;