import { loginWithEmail } from "../services/authServices.js";

class LoginController {
   static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            const user = await loginWithEmail(email, password);
            // Remove password before sending user data
            user.password = undefined;
            res.json(user);


        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({ error: 'Invalid email or password' });
        }
   }
}
export default LoginController;