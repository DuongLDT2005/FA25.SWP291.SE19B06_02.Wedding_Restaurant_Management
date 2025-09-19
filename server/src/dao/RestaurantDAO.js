import db from "../config/db.js";
import Restaurant from "../models/Restaurant.js";

class RestaurantDAO {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM Restaurant");
    return rows.map((r) => new Restaurant(r));
  }

  static async getById(restaurantID) {
    const [rows] = await db.query(
      "SELECT * FROM Restaurant WHERE restaurantID = ?",
      restaurantID
    );
    if (rows.length === 0) return null;
    return new Restaurant(rows[0]);
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
    hallCount,
    addressID,
    thumbnailURL,
    status,
  }) {
    const [result] = await db.query(
      `INSERT INTO Restaurant(ownerID, name, description, hallCount, addressID, thumbnailURL, status)
        VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [
        ownerID,
        name,
        description,
        hallCount || 0,
        addressID,
        thumbnailURL,
        status ?? 1,
      ]
    );

    return new Restaurant({
      restaurantID: result.insertId,
      ownerID,
      name,
      description,
      hallCount: hallCount || 0,
      addressID,
      thumbnailURL,
      status: status ?? 1,
    });
  }

  static async updateRestaurant(restaurantID, { ownerID, name, description, hallCount, addressID, thumbnailURL, status }) {
    await db.query(
      `UPDATE Restaurant 
       SET ownerID = ?, name = ?, description = ?, hallCount = ?, addressID = ?, thumbnailURL = ?, status = ?
       WHERE restaurantID = ?`,
      [ownerID, name, description, hallCount, addressID, thumbnailURL, status, restaurantID]
    );

    return new Restaurant({
      restaurantID,
      ownerID,
      name,
      description,
      hallCount,
      addressID,
      thumbnailURL,
      status
    });
  }

  static async deleteRestaurant(restaurantID) {
    const [result] = await db.query("DELETE FROM Restaurant WHERE restaurantID = ?", [restaurantID]);
    return result.affectedRows > 0;
  }

}

export default RestaurantDAO;
