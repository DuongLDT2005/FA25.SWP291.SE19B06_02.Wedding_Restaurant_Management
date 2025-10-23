import db from "../config/db.js";

class BookingDAO {
  // Tạo mới 1 booking cùng các thông tin con
  async createBooking(bookingData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const {
        customerID,
        hallID,
        bookingDate,
        startTime,
        endTime,
        totalPrice,
        status,
        dishes = [],
        services = [],
        promotions = [],
      } = bookingData;

      // 1️⃣ Insert booking chính
      const [bookingResult] = await connection.query(
        `INSERT INTO Booking (customerID, hallID, bookingDate, startTime, endTime, totalPrice, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [customerID, hallID, bookingDate, startTime, endTime, totalPrice, status]
      );

      const bookingID = bookingResult.insertId;

      // 2️⃣ Insert booking_dishes
      for (const dish of dishes) {
        await connection.query(
          `INSERT INTO BookingDish (bookingID, dishID, quantity)
           VALUES (?, ?, ?)`,
          [bookingID, dish.dishID, dish.quantity]
        );
      }

      // 3️⃣ Insert booking_services
      for (const service of services) {
        await connection.query(
          `INSERT INTO BookingService (bookingID, serviceID)
           VALUES (?, ?)`,
          [bookingID, service.serviceID]
        );
      }

      // 4️⃣ Insert booking_promotions
      for (const promo of promotions) {
        await connection.query(
          `INSERT INTO BookingPromotion (bookingID, promotionID)
           VALUES (?, ?)`,
          [bookingID, promo.promotionID]
        );
      }

      await connection.commit();
      return { bookingID, message: "Booking created successfully!" };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Lấy tất cả booking
  async getAllBookings() {
    const [rows] = await db.query(
      `SELECT * FROM Booking ORDER BY bookingDate DESC`
    );
    return rows;
  }

  // Lấy booking theo ID (bao gồm dishes, services, promotions)
  async getBookingById(bookingID) {
    const [bookings] = await db.query(`SELECT * FROM Booking WHERE bookingID = ?`, [bookingID]);
    if (bookings.length === 0) return null;

    const [dishes] = await db.query(
      `SELECT bd.*, d.name, d.price
       FROM BookingDish bd
       JOIN Dish d ON bd.dishID = d.dishID
       WHERE bd.bookingID = ?`,
      [bookingID]
    );

    const [services] = await db.query(
      `SELECT bs.*, s.name, s.price
       FROM BookingService bs
       JOIN Service s ON bs.serviceID = s.serviceID
       WHERE bs.bookingID = ?`,
      [bookingID]
    );

    const [promotions] = await db.query(
      `SELECT bp.*, p.name, p.discountValue
       FROM BookingPromotion bp
       JOIN Promotion p ON bp.promotionID = p.promotionID
       WHERE bp.bookingID = ?`,
      [bookingID]
    );

    return { ...bookings[0], dishes, services, promotions };
  }

  // Xóa booking
  async deleteBooking(bookingID) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(`DELETE FROM BookingDish WHERE bookingID = ?`, [bookingID]);
      await connection.query(`DELETE FROM BookingService WHERE bookingID = ?`, [bookingID]);
      await connection.query(`DELETE FROM BookingPromotion WHERE bookingID = ?`, [bookingID]);
      await connection.query(`DELETE FROM Booking WHERE bookingID = ?`, [bookingID]);

      await connection.commit();
      return { message: "Booking deleted successfully." };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

export default new BookingDAO();
