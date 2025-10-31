import { Router } from 'express';
import { authenticateJWT } from '../middlewares/jwtToken.js';
import BookingController from '../controllers/BookingController.js';

const router = Router();

// Basic listing/CRUD (wire a few common ones to existing controller)
router.get('/', BookingController.getAllBookings);
router.get('/:id', BookingController.getBookingById);
router.post('/', BookingController.createBooking);
router.put('/:id', BookingController.updateBooking);
router.delete('/:id', BookingController.deleteBooking);

// Partner-only middleware
function ensurePartner(req, res, next) {
  const role = req.user?.role;
  if (role !== 'owner') {
    return res.status(403).json({ error: 'Partner only' });
  }
  return next();
}

// Partner accept booking
router.post('/:id/partner/accept', authenticateJWT, ensurePartner, BookingController.acceptByPartner);

// Partner reject booking
router.post('/:id/partner/reject', authenticateJWT, ensurePartner, BookingController.rejectByPartner);

export default router;
