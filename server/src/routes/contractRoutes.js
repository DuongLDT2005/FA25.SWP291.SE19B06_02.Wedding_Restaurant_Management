import { Router } from 'express';
import { authenticateJWT, ensureCustomer, ensurePartner } from '../middlewares/jwtToken.js';
import ContractController from '../controllers/ContractController.js';

const router = Router();

// Customer signs (uploads signed file) - allowed only after booking DEPOSITED
router.post('/:id/customer/sign', authenticateJWT, ensureCustomer, ContractController.signContract);

// Partner uploads signed contract (optional)
router.post('/:id/partner/upload', authenticateJWT, ensurePartner, ContractController.partnerUpload);

export default router;
