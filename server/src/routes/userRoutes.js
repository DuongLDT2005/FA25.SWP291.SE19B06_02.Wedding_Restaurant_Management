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


export default router;
