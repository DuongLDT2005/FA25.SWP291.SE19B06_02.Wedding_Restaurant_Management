import BookingDAO from "../dao/BookingDAO.js";

class BookingService {
  async createBooking(data) {
    if (!data.customerID || !data.hallID || !data.bookingDate) {
      throw new Error("Missing required fields: customerID, hallID, bookingDate");
    }

    // Business logic: kiểm tra giờ hợp lệ, giá > 0, ...
    if (data.totalPrice < 0) {
      throw new Error("Total price must be positive");
    }

    return await BookingDAO.createBooking(data);
  }

  async getAllBookings() {
    return await BookingDAO.getAllBookings();
  }

  async getBookingById(bookingID) {
    const booking = await BookingDAO.getBookingById(bookingID);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  }

  async deleteBooking(bookingID) {
    return await BookingDAO.deleteBooking(bookingID);
  }
}

export default new BookingService();
