import AuthController from "../controllers/authController.js";
import { Router } from "express";
import upload from "../middlewares/upload.js";
import { authenticateJWT } from "../middlewares/jwtToken.js";
 const router = Router();

router.post(
  "/signup/owner",
  upload.single("license"),     // nhận file từ FE
  AuthController.signupOwner
);
router.post('/signup/customer', AuthController.signupCustomer);


router.get('/me', authenticateJWT, AuthController.getCurrentUser);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
// forgotPassword
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/reset-password', AuthController.resetPassword);

router.post("/google", AuthController.googlePopupLogin);

router.put(
  "/admin/owners/:id/approve",
  authenticateJWT,
  authorizeAdmin,          // CHỈ admin được duyệt
  AuthController.approveOwner
);

router.put(
  "/admin/owners/:id/activate",
  authenticateJWT,
  authorizeAdmin,
  AuthController.activateOwner
);

export default router;