import {Router} from "express";
import UserController from "../controllers/UserController.js";
import loginController from "../controllers/LoginController.js";
const router = Router();

router.post('/signup/owner', UserController.createOwner);
router.post('/signup/customer', UserController.createCustomer);
router.get('/', UserController.getAllUsers);
router.get('/owners', UserController.getOwners);
router.get('/customers', UserController.getCustomers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.post('/login', loginController.login); // Add login route

export default router;
