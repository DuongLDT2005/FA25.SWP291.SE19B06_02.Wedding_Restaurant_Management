// src/services/BookingService.js
import BookingDAO from "../../dao/BookingDAO.js";
import HallDAO from "../../dao/HallDAO.js";
import MenuDAO from "../../dao/MenuDAO.js";
import SystemSettingDAO from "../../dao/SystemSettingDAO.js";
import ServiceDAO from "../../dao/ServiceDAO.js";
import PromotionDAO from "../../dao/PromotionDAO.js";
import ContractDAO, { ContractStatus } from "../../dao/ContractDAO.js";
import ContractServices from "../ContractServices.js";
import BookingPricing from "./BookingPricing.js";
import BookingStatus from "../../models/enums/BookingStatus.js";
import { sendBookingStatusEmail } from "../../utils/mail/mailer.js";
import UserDAO from "../../dao/userDao.js";
import NotificationService from "../NotificationServices.js";
import db from "../../config/db.js";
import { notifyByStatusById } from "./BookingNotificationService.js";

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

    // --- Pricing using BookingPricing engine ---
    // Load hall & menu prices
    const hall = await HallDAO.getHallById(hallID);
    if (!hall) throw new Error("Hall not found");
    const menu = await MenuDAO.getByID(menuID, { includeDishes: false });
    if (!menu) throw new Error("Menu not found");

    const engine = new BookingPricing({ tableCount, services });
    await engine.calculateBasePrice(hall, menu);

    // Load promotions details if provided
    let promoInputs = [];
    if (Array.isArray(promotionIDs) && promotionIDs.length > 0) {
      const promos = await Promise.all(
        promotionIDs.map((pid) => PromotionDAO.getByID(pid))
      );
      // Normalize promotions to engine format; also expand "Free" promotions to individual freeServiceID entries
      for (let i = 0; i < promos.length; i++) {
        const p = promos[i];
        if (!p) continue;
        // Percent discount
        if (p.discountPercentage && (!p.discountType || p.discountType === 'Percent')) {
          promoInputs.push({ discountType: 0, discountValue: Number(p.discountPercentage) || 0, minTable: p.minTable || 0 });
        }
        // Free service(s)
        if (p.discountType === 'Free') {
          const freeSvcs = await PromotionDAO.getServicesByPromotionID(p.promotionID);
          for (const svc of freeSvcs) {
            promoInputs.push({ discountType: 1, freeServiceID: svc.serviceID, minTable: p.minTable || 0 });
          }
        }
      }
    }
    await engine.applyPromotions(promoInputs);

    // Load info for selected services
    let allServices = [];
    if (Array.isArray(services) && services.length > 0) {
      const ids = [...new Set(services.map((s) => s.serviceID).filter(Boolean))];
      allServices = await Promise.all(ids.map((id) => ServiceDAO.getByID(id)));
      allServices = allServices.filter(Boolean);
    }
    await engine.applyPaidServices(allServices);

    // VAT rate from settings or default 8%
    let vatRate = '0.08';
    try {
      const vatSetting = await SystemSettingDAO.getByKey('VAT_RATE');
      if (vatSetting?.settingValue) vatRate = String(vatSetting.settingValue);
    } catch { }
    await engine.calculateTotals({ VAT_RATE: vatRate });

    // Create booking with computed amounts; use engine.services (priced per-unit via appliedPrice)
    return await BookingDAO.createBooking(
      {
        customerID,
        eventTypeID,
        hallID,
        menuID,
        eventDate,
        startTime,
        endTime,
        tableCount,
        specialRequest,
        originalPrice: engine.originalPrice,
        discountAmount: engine.discountAmount,
        VAT: engine.VAT,
        totalAmount: engine.totalAmount,
      },
      {
        dishIDs,
        services: engine.services,
        promotionIDs,
      }
    );

    return booking;
  }

  /**
   * Create a manual/blocked booking (external booking) that reserves a time slot for a hall.
   * This booking has no customer (customerID = null) and status = MANUAL_BLOCKED.
   * Useful when restaurant admin wants to mark a timeslot as already booked by an external system.
   * Required fields: hallID, eventDate, startTime, endTime, tableCount
   */
  async setBooking(data, actorPartnerID = null) {
    const { hallID, eventDate, startTime, endTime, tableCount, specialRequest = '', menuID = null, eventTypeID = null } = data;
    if (!hallID || !eventDate || !startTime || !endTime || !Number.isInteger(tableCount) || tableCount <= 0) {
      throw new Error('Missing required fields for manual booking (hallID, eventDate, startTime, endTime, tableCount)');
    }

    // Validate date/time
    const now = new Date();
    const event = new Date(eventDate);
    if (isNaN(event.getTime())) throw new Error('Invalid event date format.');
    if (event < now) throw new Error('Event date cannot be in the past.');

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    if (start >= end) throw new Error('Invalid time range: startTime must be before endTime.');

    // Check overlapping bookings for the hall
    const overlapping = await BookingDAO.findByHallAndTime(hallID, eventDate, startTime, endTime);
    if (overlapping.length > 0) throw new Error('This hall is already booked for the selected time range.');

    // If actorPartnerID provided, ensure partner owns the hall's restaurant
    if (actorPartnerID) {
      const ownerPartner = await BookingDAO.getRestaurantPartnerByHallID(hallID);
      if (!ownerPartner || String(ownerPartner.restaurantPartnerID) !== String(actorPartnerID)) {
        throw new Error('Not authorized to create manual booking for this hall');
      }
    }

    // Create a booking record with customerID = null and status = MANUAL_BLOCKED
    const bookingData = {
      customerID: null,
      eventTypeID,
      hallID,
      menuID,
      eventDate,
      startTime,
      endTime,
      tableCount,
      specialRequest,
      status: BookingStatus.MANUAL_BLOCKED,
    };

    const created = await BookingDAO.createBooking(bookingData, { dishIDs: [], services: [], promotionIDs: [] });
    // Immediately set status via DAO (in case createBooking doesn't persist status field)
    if (created && created.bookingID) {
      await BookingDAO.updateBooking(created.bookingID, { status: BookingStatus.MANUAL_BLOCKED, customerID: null });
    }
    return created;
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

  /** ✅ GET BY CUSTOMER */
  async getBookingsByCustomerId(customerID, { status = null, isChecked = null } = {}) {
    if (!customerID) throw new Error("Missing customerID.");
    return BookingDAO.getBookingsByCustomer({ customerID, status, isChecked });
  }

  /** ✅ GET BY PARTNER (all bookings under partner-owned restaurants)
   * options: { detailed?: boolean }
   */
  async getBookingsByPartnerId(partnerID, { detailed = false } = {}) {
    if (!partnerID) throw new Error("Missing partnerID.");
    if (detailed) return BookingDAO.getBookingsByPartnerDetailed(partnerID);
    return BookingDAO.getBookingsByPartner(partnerID);
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
    // Delegate to centralized changeStatus (transactional + afterCommit notifications)
    // Accept an options object so controller can pass actor info (actorId, actorRole, reason)
    // and any other flags (e.g., setChecked).
    if (typeof isChecked === 'object' && isChecked !== null) {
      // called as updateBookingStatus(id, status, opts)
      return this.changeStatus(bookingID, status, isChecked);
    }
    // called as updateBookingStatus(id, status, isCheckedBoolean)
    return this.changeStatus(bookingID, status, { setChecked: isChecked });
  }

  /**
   * Centralized status change with transaction and afterCommit notifications.
   * opts: { actorId, actorRole, reason, setChecked }
   */
  async changeStatus(bookingID, status, opts = {}) {
    const { actorId, actorRole, reason, setChecked = true } = opts;
    if (!bookingID || !status) throw new Error("Missing bookingID or status.");

    const validStatuses = Object.values(BookingStatus);
    if (!validStatuses.includes(status)) throw new Error("Invalid booking status.");

    const { sequelize } = db;

    const result = await sequelize.transaction(async (t) => {
      // Lock the row to avoid race conditions via DAO helper
      const bk = await BookingDAO.getBookingForUpdate(bookingID, { transaction: t });
      if (!bk) throw new Error('Booking not found');

      const prev = bk.status;

      // Basic RBAC examples (caller may still validate before calling):
      if ((status === BookingStatus.ACCEPTED || status === BookingStatus.REJECTED) && actorRole !== 1) {
        throw new Error('Only partner can accept or reject bookings');
      }

      if (status === BookingStatus.CONFIRMED && !actorId) {
        throw new Error('Authentication required to confirm booking');
      }

      // Optionally validate allowed transitions (simple example)
      // e.g., only PENDING -> ACCEPTED/REJECTED
      if ((status === BookingStatus.ACCEPTED || status === BookingStatus.REJECTED) && prev !== BookingStatus.PENDING) {
        throw new Error('Only PENDING bookings can be accepted or rejected');
      }

      // Perform update via DAO (transaction-aware)
      await BookingDAO.updateBookingStatusWithTransaction(bookingID, status, { isChecked: setChecked, transaction: t });

      // after commit, send notifications (best-effort)
      t.afterCommit(async () => {
        try {
          await notifyByStatusById(bookingID, status, { reason });
        } catch (e) {
          console.error(`Notification for status ${status} on booking ${bookingID} failed:`, e?.message || e);
        }
      });

      return { success: true, previous: prev, status };
    });

    return result;
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

    // Use centralized changeStatus (transaction + afterCommit notification)
    await this.changeStatus(bookingID, BookingStatus.ACCEPTED, { actorId: partnerID, actorRole: 1 });

    // Create a Contract record linked to this booking so partner/customer can upload/sign it.
    // Use booking details we already loaded above to get restaurantID.
    try {
      // Generate HTML contract, persist file and DB record
      await ContractServices.createContractFromBooking(bookingID);
    } catch (e) {
      console.error(`Failed to create contract for booking ${bookingID}:`, e?.message || e);
    }

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

    await this.changeStatus(bookingID, BookingStatus.REJECTED, { actorId: partnerID, actorRole: 1, reason });
    return await BookingDAO.getBookingById(bookingID);
  }
  async depositBooking(bookingID) {
    if (!bookingID) throw new Error("Missing bookingID.");
    const booking = await BookingDAO.getBookingDetails(bookingID);
    if (!booking) throw new Error("Booking not found.");
    await this.changeStatus(bookingID, BookingStatus.DEPOSITED);
    return await BookingDAO.getBookingById(bookingID);
  }
  async confirmBooking(bookingID) {
    if (!bookingID) throw new Error("Missing bookingID.");
    const booking = await BookingDAO.getBookingDetails(bookingID);
    if (!booking) throw new Error("Booking not found.");
    await this.changeStatus(bookingID, BookingStatus.CONFIRMED);
    // Expiration is handled by cron (bulkExpireConfirmedOlderThanBatch)
    return await BookingDAO.getBookingById(bookingID);
  }
  async completeBooking(bookingID) {
    if (!bookingID) throw new Error("Missing bookingID.");
    const booking = await BookingDAO.getBookingDetails(bookingID);
    if (!booking) throw new Error("Booking not found.");
    await this.changeStatus(bookingID, BookingStatus.COMPLETED);
    return await BookingDAO.getBookingById(bookingID);
  }
  // take 
}


export default new BookingService();
