import BookingService from "../services/BookingService.js";

class BookingController {
  async createBooking(req, res) {
    try {
      const result = await BookingService.createBooking(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAllBookings(req, res) {
    try {
      const bookings = await BookingService.getAllBookings();
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getBookingById(req, res) {
    try {
      const booking = await BookingService.getBookingById(req.params.id);
      res.status(200).json(booking);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  async deleteBooking(req, res) {
    try {
      const result = await BookingService.deleteBooking(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new BookingController();
