import {Router} from "express";
import UserController from "../controllers/UserController.js";

const router = Router();


router.get('/', UserController.getAllUsers);
router.get('/owners', UserController.getOwners);
router.post('/update/status/:id', UserController.updateUserStatus);
router.get('/customers', UserController.getCustomers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

// GET /api/admin/partners/pending
router.get("/partners/pending", UserController.getPendingPartners);
// GET /api/admin/partners/approved
router.get("/partners/approved", UserController.getApprovedPartners);
// PATCH /api/admin/partners/:id/approve
router.patch("/partners/:id/approve", UserController.approvePartner);
// PATCH /api/admin/partners/:id/reject
router.patch("/partners/:id/reject", UserController.rejectPartner);

export default router;
