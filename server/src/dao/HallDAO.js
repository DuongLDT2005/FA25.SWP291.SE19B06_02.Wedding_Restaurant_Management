import Hall from "../models/Hall.js";
import db from "../config/db.js";
import { hallStatus } from "../models/Hall.js";
import RestaurantDAO from "./RestaurantDAO.js";
class HallDAO {
    static async createHall(hall) {
        const { restaurantID, name, description, capacity, area, price, status } = hall;
        const [result] = await db.query(
            'INSERT INTO Hall (restaurantID, name, description, capacity, area, price, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [restaurantID, name, description, capacity, area, price, status]
        );
        hall.hallID = result.insertId;
        
        // Increment hall count in the restaurant
        await RestaurantDAO.incrementHallCount(restaurantID);

        return hall;
    }
    static async getHallById(hallID) {
        const [rows] = await db.query('SELECT * FROM Hall WHERE hallID = ?', [hallID]);
        if (rows.length === 0) return null;
        const row = rows[0];
        const statusValue = Buffer.isBuffer(row.status) ? row.status[0] : row.status;
        return new Hall(row.hallID, row.restaurantID, row.name, row.description, row.capacity, row.area, row.price, statusValue);
    }
    static async getHallsByRestaurantId(restaurantID) {
        const [rows] = await db.query('SELECT * FROM Hall WHERE restaurantID = ?', [restaurantID]);
        return rows.map(row => {
            const statusValue = Buffer.isBuffer(row.status) ? row.status[0] : row.status;
            return new Hall(row.hallID, row.restaurantID, row.name, row.description, row.capacity, row.area, row.price, statusValue);
        });
    }
    static async updateHall(hallID, hallData) {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(hallData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        values.push(hallID);
        const [result] = await db.query(
            `UPDATE Hall SET ${fields.join(', ')} WHERE hallID = ?`,
            values
        );
    }
    static async deleteHall(hallID) {
        const [result] = await db.query('DELETE FROM Hall WHERE hallID = ?', [hallID]);
        // Decrement hall count in the restaurant
        await RestaurantDAO.decrementHallCount(hallID);
        return result.affectedRows > 0;
    }
    static async updateHallStatus(hallID, status) {
        const [result] = await db.query(
            'UPDATE Hall SET status = ? WHERE hallID = ?',
            [status, hallID]
        );
        return result.affectedRows > 0;
    }

}

export default HallDAO;