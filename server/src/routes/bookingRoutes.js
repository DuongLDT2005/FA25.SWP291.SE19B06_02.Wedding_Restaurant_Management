// src/routes/bookingRoutes.js
import express from "express";
import BookingService from "../services/BookingServices.js";

const router = express.Router();

// POST /api/bookings
router.post("/", async (req, res) => {
  try {
    const booking = await BookingService.createBooking(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
