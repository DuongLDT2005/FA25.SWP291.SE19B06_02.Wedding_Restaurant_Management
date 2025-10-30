// src/services/BookingService.js
import BookingDAO from "../dao/BookingDAO.js";
import HallDAO from "../dao/HallDAO.js";
import MenuDAO from "../dao/MenuDAO.js";
import NotificationService from "./NotificationServices.js";
import BookingStatus from "../models/enums/BookingStatus.js";

class BookingService {
  /**
   * ✅ CREATE BOOKING
   * - Validate dữ liệu
   * - Check trùng giờ, giới hạn booking
   * - Tính giá cơ bản
   * - Lưu DB (transaction)
   * - Gửi email partner (pending)
   */
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
      specialRequest = "",
      dishIDs = [],
      services = [],
      promotionIDs = [],
    } = data;

    // 1️⃣ Validate cơ bản
    if (!customerID || !eventTypeID || !hallID || !menuID || !eventDate || !startTime || !endTime)
      throw new Error("Missing required fields.");
    if (!Number.isInteger(tableCount) || tableCount <= 0)
      throw new Error("Invalid table count.");

    const now = new Date();
    const event = new Date(eventDate);
    if (isNaN(event.getTime())) throw new Error("Invalid event date format.");
    if (event < now) throw new Error("Event date cannot be in the past.");

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    if (start >= end)
      throw new Error("Invalid time range: startTime must be before endTime.");

    // 2️⃣ Check trùng giờ sảnh
    const overlapping = await BookingDAO.findByHallAndTime(hallID, eventDate, startTime, endTime);
    if (overlapping.length > 0)
      throw new Error("This hall is already booked for the selected time range.");

    // 3️⃣ Giới hạn đặt chỗ khách hàng
    const customerBookings = await BookingDAO.findByCustomerAndDate(customerID, eventDate);
    if (customerBookings.length >= 3)
      throw new Error("Customer has reached the maximum number of bookings for this date.");

    // 4️⃣ Tính giá cơ bản
    const [hall, menu] = await Promise.all([
      HallDAO.getHallById(hallID),
      MenuDAO.getByID(menuID),
    ]);
    if (!hall || !menu) throw new Error("Hall or menu not found.");

    const hallPrice = +hall.price || 0;
    const menuPrice = +menu.price || 0;
    const basePrice = hallPrice + menuPrice * tableCount;
    const VAT = basePrice * 0.1;
    const total = basePrice + VAT;

    // 5️⃣ Chuẩn bị dữ liệu booking
    const bookingData = {
      customerID,
      eventTypeID,
      hallID,
      menuID,
      eventDate,
      startTime,
      endTime,
      tableCount,
      specialRequest,
      status: BookingStatus.PENDING,
      originalPrice: basePrice,
      VAT,
      totalAmount: total,
    };

    // 6️⃣ Transaction tạo booking + gắn kèm
    const booking = await BookingDAO.createBooking(bookingData, {
      dishIDs,
      services,
      promotionIDs,
    });

    // 7️⃣ Gửi mail cho partner (chỉ khi có email)
    const [partner, customer] = await Promise.all([
      BookingDAO.getRestaurantPartnerByHallID(hallID),
      BookingDAO.getCustomerByID(customerID),
    ]);

    if (partner?.email || customer?.email) {
      await NotificationService.sendBookingStatusChange({
        bookingID: booking.bookingID,
        customerEmail: customer?.email,
        partnerEmail: partner?.email,
        status: BookingStatus.PENDING,
      });
    }

    return booking;
  }

  /** ✅ GET ALL */
  async getAllBookings() {
    return BookingDAO.getAllBookings();
  }

  /** ✅ GET ONE */
  async getBookingById(bookingID) {
    if (!bookingID) throw new Error("Missing bookingID.");
    return BookingDAO.getBookingById(bookingID);
  }

  /** ✅ UPDATE (partial) */
  async updateBooking(bookingID, data) {
    if (!bookingID) throw new Error("Missing bookingID.");
    return BookingDAO.updateBooking(bookingID, data);
  }

  /** ✅ DELETE */
  async deleteBooking(bookingID) {
    if (!bookingID) throw new Error("Missing bookingID.");
    return BookingDAO.deleteBooking(bookingID);
  }

  /**
   * ✅ UPDATE STATUS
   * - Partner / Customer / System cập nhật
   * - Tự động gửi mail theo trạng thái
   */
  async updateBookingStatus(bookingID, status, isChecked = true) {
    if (!bookingID || !status) throw new Error("Missing bookingID or status.");

    const validStatuses = Object.values(BookingStatus);
    if (!validStatuses.includes(status))
      throw new Error("Invalid booking status.");

    const updated = await BookingDAO.updateBookingStatus(bookingID, status, { isChecked });
    if (!updated) throw new Error("Booking not found or update failed.");

    const booking = await BookingDAO.getBookingDetails(bookingID);
    const customer = booking?.customer;
    const partner = await BookingDAO.getRestaurantPartnerByHallID(booking.hallID);

    await NotificationService.sendBookingStatusChange({
      bookingID,
      customerEmail: customer?.email,
      partnerEmail: partner?.email,
      status,
    });

    return { success: true, status };
  }
}

export default new BookingService();
