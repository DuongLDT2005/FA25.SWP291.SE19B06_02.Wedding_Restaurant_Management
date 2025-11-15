// src/routes/admin/adminUserRoutes.js
import { Router } from "express";
import UserController from "../../controllers/UserController.js";

const router = Router();

// ======================
// 📌 USER MANAGEMENT
// ======================
router.get("/", UserController.getAllUsers); 
router.get("/customers", UserController.getCustomers);
router.get("/owners", UserController.getOwners);

// Update status (lock/unlock)
router.post("/update/status/:id", UserController.updateUserStatus);

// Get user detail
router.get("/:id", UserController.getUserById);

// Update user info
router.put("/:id", UserController.updateUser);

// Delete user
router.delete("/:id", UserController.deleteUser);

// ======================
// 📌 PARTNER LICENSE MANAGEMENT
// ======================
router.get("/partners/pending", UserController.getPendingPartners);
router.get("/partners/approved", UserController.getApprovedPartners);

router.put("/partners/:id/approve", UserController.approvePartner);
router.put("/partners/:id/reject", UserController.rejectPartner);

export default router;
