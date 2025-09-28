import AuthController from "../controllers/authController.js";
import { Router } from "express";
import { authenticateJWT } from "../middlewares/jwtToken.js";
 const router = Router();

router.post('/signup/owner', AuthController.signupOwner);
router.post('/signup/customer', AuthController.signupCustomer);
router.get('/me', authenticateJWT, AuthController.getCurrentUser);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
// router.post('/forgot-password', AuthController.forgotPassword);
// router.post('/reset-password', AuthController.resetPassword);
export default router;