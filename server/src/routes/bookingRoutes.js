import { Router } from "express";
import { authenticateJWT } from "../middlewares/jwtToken.js";
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
router.get("/:id", BookingController.getBookingById);
router.post("/", BookingController.createBooking);
router.put("/:id", BookingController.updateBooking);
router.delete("/:id", BookingController.deleteBooking);

// ======================
// 📌 Partner Booking Actions
// ======================
function ensurePartner(req, res, next) {
  const role = req.user?.role;
  if (role !== 1) {
    return res.status(403).json({ error: "Partner only" });
  }
  return next();
}

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
