import db from "../config/db.js";
import Restaurant from "../models/Restaurant.js";
import RestaurantImage from "../models/RestaurantImage.js";

class RestaurantDAO {
  static async getAll() {
    const [rows] = await db.query(
      `SELECT r.restaurantID, r.restaurantPartnerID, r.name, r.description, r.hallCount, r.addressID, r.thumbnailURL, r.status, a.fullAddress
    FROM Restaurant r
    JOIN Address a ON r.addressID = a.addressID`
    );
    return rows.map((r) => ({
      ...new Restaurant(r),
      address: r.fullAddress,
    }));
  }

  static async getAllByPartnerID(restaurantPartnerID) {
    const [rows] = await db.query(
      `SELECT r.restaurantID, r.restaurantPartnerID, r.name, r.description, r.hallCount, r.addressID, r.thumbnailURL, r.status, a.fullAddress
      FROM Restaurant r 
      JOIN Address a ON r.addressID = a.addressID
      WHERE r.restaurantPartnerID = ?`,
      [restaurantPartnerID]
    );
    return rows.map((r) => ({
      ...new Restaurant(r),
      address: r.fullAddress,
    }));
  }

  static async getByID(restaurantID) {
    const [rows] = await db.query(
      `SELECT r.restaurantID, r.restaurantPartnerID, r.name, r.description, r.hallCount, r.addressID, r.thumbnailURL, r.status, a.fullAddress
      FROM Restaurant r
      JOIN Address a ON r.addressID = a.addressID
      WHERE r.restaurantID = ?`,
      [restaurantID]
    );

    if (rows.length === 0) return null;

    const [images] = await db.query(
      `SELECT ri.imageID, ri.imageURL 
        FROM RestaurantImage ri 
        WHERE ri.restaurantID = ?`,
      [restaurantID]
    );

    return {
      ...new Restaurant(rows[0]),
      address: rows[0].fullAddress,
      images: images.map((img) => new RestaurantImage(img)),
    };
  }
  /* 
constructor({
    restaurantID,
    restaurantPartnerID,
    name,
    description,
    hallCount,
    addressID,
    thumbnailURL,
    status,
  }) {*/
  static async createRestaurant({
    restaurantPartnerID,
    name,
    description,
    address,
    thumbnailURL,
    status,
  }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      //INSERT ADDRESS
      const [addressResult] = await conn.query(
        `INSERT INTO Address(number, street, ward) VALUES (?, ?, ?)`,
        [address.number, address.street, address.ward]
      );
      const newAddressID = addressResult.insertId;

      //INSERT RESTAURANT
      const [restaurantResult] = await conn.query(
        `INSERT INTO Restaurant(restaurantPartnerID, name, description, addressID, thumbnailURL, status)
        VALUES(?, ?, ?, ?, ?, ?)`,
        [
          restaurantPartnerID,
          name,
          description,
          newAddressID,
          thumbnailURL,
          status ?? 1,
        ]
      );

      await conn.commit();

      return new Restaurant({
        restaurantID: restaurantResult.insertId,
        restaurantPartnerID,
        name,
        description,
        hallCount: 0,
        addressID: newAddressID,
        thumbnailURL,
        status: status ?? 1,
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async updateRestaurant(
    restaurantID,
    { restaurantPartnerID, name, description, address, thumbnailURL }
  ) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [[restaurant]] = await conn.query(
        `SELECT addressID FROM Restaurant WHERE restaurantID = ?`,
        [restaurantID]
      );
      if (!restaurant) throw new Error("Restaurant not found");

      const addressID = restaurant.addressID;

      if (address) {
        await conn.query(
          `UPDATE Address SET number = ?, street = ?, ward = ? WHERE addressID = ?`,
          [address.number, address.street, address.ward, addressID]
        );
      }

      await conn.query(
        `
      UPDATE Restaurant
      SET restaurantPartnerID = ?, name = ?, description = ?, 
          thumbnailURL = ?
      WHERE restaurantID = ?
    `,
        [restaurantPartnerID, name, description, thumbnailURL, restaurantID]
      );

      await conn.commit();

      return await this.getByID(restaurantID);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async toggleRestaurantStatus(restaurantID) {
    const [result] = await db.query(
      "UPDATE Restaurant SET status = CASE WHEN status = 1 THEN 0 ELSE 1 END WHERE restaurantID = ?",
      [restaurantID]
    );
    return result.affectedRows > 0;
  }

  static async search({ location, capacity, date, minPrice, maxPrice }) {
    let query = `SELECT DISTINCT r.restaurantID, r.restaurantPartnerID, r.name, r.description, r.hallCount,
    r.addressID, r.thumbnailURL, r.status, a.fullAddress, h.hallID, h.name as hallName, h.capacity, h.price
    FROM Restaurant r
    JOIN Address a ON r.addressID = a.addressID
    JOIN Hall h ON r.restaurantID = h.restaurantID
    WHERE r.status = 1 AND h.status = 1`;

    const params = [];

    if (location) {
      query += " AND a.fullAddress LIKE ? ";
      params.push(`%${location}%`);
    }

    if (capacity) {
      query += " AND h.capacity >= ?";
      params.push(capacity);
    }

    if (minPrice) {
      query += " AND h.price >= ? ";
      params.push(minPrice);
    }

    if (maxPrice) {
      query += " AND h.price <= ? ";
      params.push(maxPrice);
    }

    if(date){
      query += 
      `And h.hallID NOT IN (SELECT b.hallID FROM Booking b  WHERE b.eventDate = ? and b.status = 1)`;
      params.push(date);
    }

    const [rows] = await db.query(query,params);

    return rows;

  }
}

export default RestaurantDAO;
