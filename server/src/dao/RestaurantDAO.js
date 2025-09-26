import db from "../config/db.js";
import Restaurant from "../models/Restaurant.js";

class RestaurantDAO {

//Ngoài ảnh chính của 1 res sẽ có nhiều res ( RestaurantImage trong database ) => Quản lý được (Thêm, sửa, xoá)
//Khi xem cụ thể 1 nhà hàng, display những ảnh trong Restaurant Image, còn khi đang tìm thì chỉ display ThumbnailURL
  static async getAll() {
    const [rows] = await db.query(
      `SELECT r.restaurantID, r.ownerID, r.name, r.description, r.hallCount, r.addressID, r.thumbnailURL, r.status, a.fullAddress
    FROM Restaurant r
    JOIN Address a ON r.addressID = a.addressID`
    );
    return rows.map((r) => ({
      ...new Restaurant(r),
      address: r.fullAddress,
    }));
  }

  static async getAllByOwnerID(ownerID) {
    const [rows] = await db.query(
      `SELECT r.restaurantID, r.ownerID, r.name, r.description, r.hallCount, r.addressID, r.thumbnailURL, r.status, a.fullAddress
      FROM Restaurant r 
      JOIN Address a ON r.addressID = a.addressID
      WHERE r.ownerID = ?`,
      [ownerID]
    );
    return rows.map((r) => ({
      ...new Restaurant(r),
      address: r.fullAddress,
    }));
  }

  static async getByID(restaurantID) {
    const [rows] = await db.query(
      `SELECT r.restaurantID, r.ownerID, r.name, r.description, r.hallCount, r.addressID, r.thumbnailURL, r.status, a.fullAddress
      FROM Restaurant r
      JOIN Address a ON r.addressID = a.addressID
      WHERE r.restaurantID = ?`,
      [restaurantID]
    );
    if (rows.length === 0) return null;

    return {
      ...new Restaurant(rows[0]),
      address: rows[0].fullAddress,
    };
  }
  /* 
constructor({
    restaurantID,
    ownerID,
    name,
    description,
    hallCount,
    addressID,
    thumbnailURL,
    status,
  }) {*/
  static async createRestaurant({
    ownerID,
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
        `INSERT INTO Restaurant(ownerID, name, description, addressID, thumbnailURL, status)
        VALUES(?, ?, ?, ?, ?, ?)`,
        [ownerID, name, description, newAddressID, thumbnailURL, status ?? 1]
      );

      await conn.commit();

      return new Restaurant({
        restaurantID: restaurantResult.insertId,
        ownerID,
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
    { ownerID, name, description, address, thumbnailURL}
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
          [address.number, address.street,address.ward, addressID]
        );
      }

      await conn.query(
        `
      UPDATE Restaurant
      SET ownerID = ?, name = ?, description = ?, 
          thumbnailURL = ?
      WHERE restaurantID = ?
    `,
        [ownerID, name, description, thumbnailURL, restaurantID]
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
}

export default RestaurantDAO;
