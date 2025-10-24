import db from "../config/db.js";
import Booking from "../models/Booking.js";

class BookingDAO {
  async createBooking(booking) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const data = booking.toJSON();

      const [bookingResult] = await connection.query(
        `INSERT INTO Booking (
          customerID, eventTypeID, hallID, menuID,
          eventDate, startTime, endTime, tableCount,
          specialRequest, status, originalPrice,
          discountAmount, VAT, totalAmount, createdAt, isChecked
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.customerID,
          data.eventTypeID,
          data.hallID,
          data.menuID,
          data.eventDate,
          data.startTime,
          data.endTime,
          data.tableCount,
          data.specialRequest,
          data.status,
          data.originalPrice,
          data.discountAmount,
          data.VAT,
          data.totalAmount,
          data.createdAt,
          data.isChecked,
        ]
      );

      const bookingID = bookingResult.insertId;

      for (const dish of booking.dishes || []) {
        await connection.query(
          `INSERT INTO BookingDish (bookingID, dishID, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [bookingID, dish.dishID, dish.quantity || 1, dish.price]
        );
      }

      for (const service of booking.services || []) {
        await connection.query(
          `INSERT INTO BookingService (bookingID, serviceID, price)
           VALUES (?, ?, ?)`,
          [bookingID, service.serviceID, service.price]
        );
      }

      for (const promo of booking.promotions || []) {
        await connection.query(
          `INSERT INTO BookingPromotion (bookingID, promotionID, discountValue)
           VALUES (?, ?, ?)`,
          [bookingID, promo.promotionID, promo.value]
        );
      }

      await connection.commit();
      return bookingID;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async getAllBookings() {
    const [rows] = await db.query(
      `SELECT * FROM Booking ORDER BY createdAt DESC`
    );
    return rows.map((row) => new Booking(row));
  }

  async getBookingById(bookingID) {
    const [bookings] = await db.query(`SELECT * FROM Booking WHERE bookingID = ?`, [bookingID]);
    if (bookings.length === 0) return null;
    const bookingData = bookings[0];

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

    const booking = new Booking({
      ...bookingData,
      dishes,
      services,
      promotions,
    });

    return booking;
  }

  async updateBooking(bookingID, booking) {
    const data = booking.toJSON();
    await db.query(
      `UPDATE Booking SET
        customerID = ?, eventTypeID = ?, hallID = ?, menuID = ?, eventDate = ?,
        startTime = ?, endTime = ?, tableCount = ?, specialRequest = ?, status = ?,
        originalPrice = ?, discountAmount = ?, VAT = ?, totalAmount = ?, isChecked = ?
       WHERE bookingID = ?`,
      [
        data.customerID,
        data.eventTypeID,
        data.hallID,
        data.menuID,
        data.eventDate,
        data.startTime,
        data.endTime,
        data.tableCount,
        data.specialRequest,
        data.status,
        data.originalPrice,
        data.discountAmount,
        data.VAT,
        data.totalAmount,
        data.isChecked,
        bookingID,
      ]
    );
  }

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
