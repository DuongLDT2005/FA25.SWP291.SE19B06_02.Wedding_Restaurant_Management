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
  if (role !== 1) {
    return res.status(403).json({ error: 'Partner only' });
  }
  return next();
}

// Partner accept booking -> reuse generic status handler
router.post(
  '/:id/partner/accept',
  authenticateJWT,
  ensurePartner,
  (req, res, next) => {
    req.body = req.body || {};
    req.body.status = 'ACCEPTED';
    next();
  },
  BookingController.updateBookingStatus
);

// Partner reject booking -> reuse generic status handler
router.post(
  '/:id/partner/reject',
  authenticateJWT,
  ensurePartner,
  (req, res, next) => {
    req.body = req.body || {};
    req.body.status = 'REJECTED';
    next();
  },
  BookingController.updateBookingStatus
);

// Generic status change endpoint (use role-based checks in controller)
router.put('/:id/status', authenticateJWT, BookingController.updateBookingStatus);

export default router;

