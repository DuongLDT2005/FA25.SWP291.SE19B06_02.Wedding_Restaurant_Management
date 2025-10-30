import BookingDAO from "../dao/BookingDAO.js";
import HallDAO from "../dao/HallDAO.js";
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
}

export default new BookingService();
