import express from 'express';
import AmenityController from '../controllers/AmenityController.js';
import { authMiddleware, ensurePartner, ensureAdmin } from '../middlewares/jwtToken.js';

const router = express.Router({ mergeParams: true });

router.get('/', AmenityController.listAll);

router.post('/', authMiddleware, ensureAdmin, AmenityController.create);

export default router;


