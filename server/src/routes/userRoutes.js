import {Router} from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/authController.js";
import { authenticateJWT } from "../middlewares/jwtToken.js";
const router = Router();

router.post('/signup/owner', AuthController.signupOwner);
router.post('/signup/customer', AuthController.signupCustomer);
router.get('/', UserController.getAllUsers);
router.get('/owners', UserController.getOwners);
// router.get('/forgot-password', AuthController.forgotPassword);
router.get('/me', authenticateJWT, AuthController.getCurrentUser);
router.post('/update/status/:id', UserController.updateUserStatus);
// router.post('/reset-password', AuthController.resetPassword);
router.get('/customers', UserController.getCustomers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

export default router;
