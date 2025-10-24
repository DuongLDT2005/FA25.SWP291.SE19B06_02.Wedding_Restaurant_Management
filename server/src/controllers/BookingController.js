import BookingService from "../services/BookingService.js";

class BookingController {
  async createBooking(req, res) {
    try {
      const result = await BookingService.createBooking(req.body);
      res.status(201).json({
        message: "Booking created successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async getAllBookings(req, res) {
    try {
      const bookings = await BookingService.getAllBookings();
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async getBookingById(req, res) {
    try {
      const { id } = req.params;
      const booking = await BookingService.getBookingById(id);
      if (!booking)
        return res.status(404).json({ message: "Booking not found" });
      res.status(200).json(booking);
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const updated = await BookingService.updateBooking(id, req.body);
      res.status(200).json({
        message: "Booking updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async deleteBooking(req, res) {
    try {
      const { id } = req.params;
      const result = await BookingService.deleteBooking(id);
      res.status(200).json({
        message: "Booking deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(400).json({ message: error.message });
    }
  }
}

export default new BookingController();
