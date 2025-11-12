import express from 'express';
import PromotionController from '../../controllers/PromotionController.js';
import { authMiddleware, ensurePartner } from '../../middlewares/jwtToken.js';

const router = express.Router();

router.post('/', authMiddleware, ensurePartner, PromotionController.create);
router.put('/:id', authMiddleware, ensurePartner, PromotionController.update);
router.delete('/:id', authMiddleware, ensurePartner, PromotionController.delete);
router.get('/restaurant/:restaurantId', PromotionController.listByRestaurant);

export default router;
