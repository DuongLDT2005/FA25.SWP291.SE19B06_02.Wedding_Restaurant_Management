
import db from '../config/db.js';
import BookingStatus, {checkedStatus} from '../enums/BookingStatus.js';
import buffer from 'buffer';
// import {bitToNumber,bitToBoolean} from '../utils/bitUtils';

class BookingDAO {
    // Create new booking
    static async createBooking(bookingData) {
         const connection = await db.getConnection();
        const booking = new Booking(bookingData);
        // Logic to save booking to the database
        try {
            await connection.beginTransaction();
            const [result] = await db.query(
            `INSERT INTO bookings
            (customerID, eventTypeID, hallID, menuID, eventDate, startTime, endTime, tableCount, specialRequest, status, originalPrice, discountAmount, VAT, totalAmount, createdAt, isChecked)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                booking.customerID,
                booking.eventTypeID,
                booking.hallID,
                booking.menuID,
                booking.eventDate,
                booking.startTime,
                booking.endTime,
                booking.tableCount,
                booking.specialRequest,
                booking.status,
                booking.originalPrice,
                booking.discountAmount,
                booking.VAT,
                booking.totalAmount,
                booking.createdAt,
                booking.isChecked
            ]
        );
            await connection.commit();
            booking.bookingID = result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
        return booking;
    }
    //Get customer booking by customerID, status, isChecked, Get RestaurantPartner by hallID
    static async getBookingsByCustomer({ customerID, status = null, isChecked = null }) {
        let query = `SELECT * FROM bookings WHERE customerID = ?`;
        const params = [customerID];
        if (status !== null) {
            query += ` AND status = ?`;
            params.push(status);
        }
        if (isChecked !== null) {
            query += ` AND isChecked = ?`;
            params.push(isChecked);
        }
        const [rows] = await db.query(query, params);
        return rows.map(row => ({
            bookingID: row.bookingID,
            customerID: row.customerID,
            eventTypeID: row.eventTypeID,
            hallID: row.hallID,
            menuID: row.menuID,
            eventDate: row.eventDate,
            startTime: row.startTime,
            endTime: row.endTime,
            tableCount: row.tableCount,
            specialRequest: row.specialRequest,
            status: row.status,
            originalPrice: row.originalPrice,
            discountAmount: row.discountAmount,
            VAT: row.VAT,
            totalAmount: row.totalAmount,
            createdAt: row.createdAt,
            isChecked: bitToNumber(row.isChecked)
        }));
    }
      
    static async getRestaurantPartnersByHallID(hallID) {
        const [rows] = await db.query(
            `SELECT rp.* FROM restaurant_partners rp
            JOIN halls h ON rp.partnerID = h.partnerID
            WHERE h.hallID = ?`,
            [hallID]
        );
        return rows.map(row => new RestaurantPartner(row));
    }
    static async updateBookingStatus(bookingID, newStatus) {
        const [result] = await db.query(
            `UPDATE bookings SET status = ? WHERE bookingID = ?`,
            [newStatus, bookingID]
        );
        return result.affectedRows > 0;
    }
   
}
export default BookingDAO;