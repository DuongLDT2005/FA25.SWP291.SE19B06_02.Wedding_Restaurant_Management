import BookingDAO from '../dao/BookingDAO.js';

class BookingServices {
    static async createBooking(bookingData) {
        return await BookingDAO.createBooking(bookingData);
    }
    static async getBookingsByCustomer(filters) {
        return await BookingDAO.getBookingsByCustomer(filters);
    }
    static async updateBookingStatus(bookingID, status) {
        return await BookingDAO.updateBookingStatus(bookingID, status);
    }
    static async markBookingAsChecked(bookingID, isChecked) {
        return await BookingDAO.markBookingAsChecked(bookingID, isChecked);
    }
}