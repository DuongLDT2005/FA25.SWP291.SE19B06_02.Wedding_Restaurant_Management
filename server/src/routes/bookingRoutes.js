import { Router } from "express";
import { authenticateJWT } from "../middlewares/jwtToken.js";
import BookingController from "../controllers/BookingController.js";
import PaymentController from "../controllers/PaymentController.js"; // ✅ thêm dòng này

const router = Router();

// ======================
// 📌 Booking CRUD Routes
// ======================
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

// Partner accept booking
router.post(
  "/:id/partner/accept",
  authenticateJWT,
  ensurePartner,
  BookingController.acceptByPartner
);

// Partner reject booking
router.post(
  "/:id/partner/reject",
  authenticateJWT,
  ensurePartner,
  BookingController.rejectByPartner
);

// ======================
// 💳 PayOS Payment Routes
// ======================

// ✅ Tạo link thanh toán PayOS
router.post(
  "/:bookingID/payment/payos",
  authenticateJWT,
  PaymentController.createPayosCheckout
);

// ✅ Webhook nhận callback từ PayOS
router.post("/payment/payos/webhook", PaymentController.payosWebhook);

// ✅ Kiểm tra trạng thái thanh toán theo orderCode
router.get(
  "/payment/payos/status/:orderCode",
  authenticateJWT,
  PaymentController.getPayosStatus
);

export default router;
