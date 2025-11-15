import { Router } from "express";
import { authenticateJWT, ensureCustomer, ensurePartner } from "../middlewares/jwtToken.js";
import BookingController from "../controllers/BookingController.js";
import PaymentController from "../controllers/PaymentController.js";

const router = Router();

// ======================
// 📌 Booking CRUD Routes
// ======================

// ⚠️ Route customer phải đặt TRÊN ":id"
router.get("/customer/:customerID", BookingController.getBookingsByCustomerId);
router.get("/restaurant/:restaurantID", BookingController.getBookingsByRestaurantId);

router.get("/", BookingController.getAllBookings);
// Authenticated customer gets own bookings
router.get('/me', authenticateJWT, ensureCustomer, BookingController.getMyBookings);
// Partner fetch own bookings (restaurants owned)
router.get('/partner/me', authenticateJWT, ensurePartner, BookingController.getBookingsByCurrentPartner);
router.get("/:id", BookingController.getBookingById);
router.post("/", BookingController.createBooking);
// Create manual/external booking (partner only)
router.post('/manual', authenticateJWT, ensurePartner, BookingController.createManualBooking);
router.put("/:id", BookingController.updateBooking);
router.delete("/:id", BookingController.deleteBooking);




router.post(
  "/:id/partner/accept",
  authenticateJWT,
  ensurePartner,
  BookingController.acceptByPartner
);

router.post(
  "/:id/partner/reject",
  authenticateJWT,
  ensurePartner,
  BookingController.rejectByPartner
);

// ======================
// 💳 PayOS Payment Routes
// ======================
router.post(
  "/:bookingID/payment/payos",
  authenticateJWT,
  PaymentController.createPayosCheckout
);

router.post("/payment/payos/webhook", PaymentController.payosWebhook);

router.get(
  "/payment/payos/status/:orderCode",
  authenticateJWT,
  PaymentController.getPayosStatus
);

export default router;
