import express from "express";
import BookingController from "../controllers/BookingController.js";

const router = express.Router();

router.post("/", BookingController.createBooking);
router.get("/", BookingController.getAllBookings);
router.get("/:id", BookingController.getBookingById);
router.delete("/:id", BookingController.deleteBooking);

export default router;
