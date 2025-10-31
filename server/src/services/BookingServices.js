import BookingDAO from "../dao/BookingDAO.js";
import HallDAO from "../dao/HallDAO.js";
import BookingStatus from "../models/enums/BookingStatus.js";
import { sendBookingStatusEmail } from "../utils/mailer.js";
class BookingService {
  async createBooking(data) {
    const {
      customerID,
      eventTypeID,
      hallID,
      menuID,
      eventDate,
      startTime,
      endTime,
      tableCount,
      specialRequest,
    } = data;

    //kiểm tra dữ liệu cơ bản
    if (!customerID || !eventTypeID || !hallID || !menuID || !eventDate || !startTime || !endTime) {
      throw new Error("Missing required fields.");
    }

    if (isNaN(tableCount) || tableCount <= 0) {
      throw new Error("Invalid table count.");
    }

    // Check định dạng ngày
    const now = new Date();
    const event = new Date(eventDate);
    if (isNaN(event.getTime())) {
      throw new Error("Invalid event date format.");
    }

    //kiểm tra logic nghiệp vụ
    
    //Ngày event không được ở quá khứ
    if (event < now) {
      throw new Error("Event date cannot be in the past.");
    }

    //Giờ bắt đầu < giờ kết thúc
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    if (start >= end) {
      throw new Error("Invalid time range: startTime must be before endTime.");
    }

    //Hall đó có bị trùng giờ không (query DB)
    const overlapping = await BookingDAO.findByHallAndTime(hallID, eventDate, startTime, endTime);
    if (overlapping.length > 0) {
      throw new Error("This hall is already booked for the selected time range.");
    }

    //(Tuỳ chọn) Kiểm tra customer có bị vượt giới hạn trong ngày
    const customerBookings = await BookingDAO.findByCustomerAndDate(customerID, eventDate);
    if (customerBookings.length >= 3) {
      throw new Error("Customer has reached the maximum number of bookings for this date.");
    }

    return await BookingDAO.createBooking({
      customerID,
      eventTypeID,
      hallID,
      menuID,
      eventDate,
      startTime,
      endTime,
      tableCount,
      specialRequest,
    });
  }

  async getAllBookings() {
    return await BookingDAO.getAllBookings();
  }

  async getBookingById(bookingID) {
    if (!bookingID) throw new Error("Missing bookingID.");
    return await BookingDAO.getBookingById(bookingID);
  }

  async updateBooking(bookingID, data) {
    if (!bookingID) throw new Error("Missing bookingID.");

    return await BookingDAO.updateBooking(bookingID, data);
  }

  async deleteBooking(bookingID) {
    if (!bookingID) throw new Error("Missing bookingID.");
    return await BookingDAO.deleteBooking(bookingID);
  }

  // Partner accepts a booking (status: PENDING -> ACCEPTED)
  async acceptByPartner(bookingID, partnerID) {
    if (!bookingID || !partnerID) throw new Error("Missing bookingID or partnerID.");

    // Load full booking details (to get customer + hall)
    const booking = await BookingDAO.getBookingDetails(bookingID);
    if (!booking) throw new Error("Booking not found.");

    // Check ownership: partner must own the hall's restaurant
    const hallID = booking.hall?.hallID || booking.hallID;
    if (!hallID) throw new Error("Invalid booking data (missing hallID).");
    const ownerPartner = await BookingDAO.getRestaurantPartnerByHallID(hallID);
    if (!ownerPartner || ownerPartner.restaurantPartnerID !== partnerID) {
      throw new Error("Not authorized to accept this booking.");
    }

    // Allowed transition
    if (booking.status !== BookingStatus.PENDING) {
      throw new Error("Only PENDING bookings can be accepted.");
    }

    const ok = await BookingDAO.updateBookingStatus(bookingID, BookingStatus.ACCEPTED);
    if (!ok) throw new Error("Failed to update booking status.");

    // Send email to customer (best effort)
    const email = booking.customer?.email;
    if (email) {
      await sendBookingStatusEmail(email, booking, 'ACCEPTED');
    }

    // Return updated booking (optional: reload)
    return await BookingDAO.getBookingById(bookingID);
  }

  // Partner rejects a booking (status: PENDING -> REJECTED)
  async rejectByPartner(bookingID, partnerID, reason = '') {
    if (!bookingID || !partnerID) throw new Error("Missing bookingID or partnerID.");

    const booking = await BookingDAO.getBookingDetails(bookingID);
    if (!booking) throw new Error("Booking not found.");

    const hallID = booking.hall?.hallID || booking.hallID;
    if (!hallID) throw new Error("Invalid booking data (missing hallID).");
    const ownerPartner = await BookingDAO.getRestaurantPartnerByHallID(hallID);
    if (!ownerPartner || ownerPartner.restaurantPartnerID !== partnerID) {
      throw new Error("Not authorized to reject this booking.");
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new Error("Only PENDING bookings can be rejected.");
    }

    const ok = await BookingDAO.updateBookingStatus(bookingID, BookingStatus.REJECTED);
    if (!ok) throw new Error("Failed to update booking status.");

    const email = booking.customer?.email;
    if (email) {
      await sendBookingStatusEmail(email, booking, 'REJECTED', { reason });
    }

    return await BookingDAO.getBookingById(bookingID);
  }
}

export default new BookingService();
