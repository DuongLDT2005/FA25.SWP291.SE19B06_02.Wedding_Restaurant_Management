import db from "../config/db.js";

const { sequelize, restaurantimage: RestaurantImageModel } = db;

class RestaurantImageDAO{
    static async getByRestaurantID(restaurantID){
        const [rows] = await db.query(
            `SELECT * FROM RestaurantImage WHERE restaurantID = ?`,
            [restaurantID]
        );
    
    return rows.map(r => new RestaurantImage(r));
    }
    static async addImage(restaurantID, imageURL){
        const [result] = await db.query(
            `INSERT INTO RestaurantImage(restaurantID, imageURL) VALUES (?, ?)`,
            [restaurantID, imageURL]
        );
        return new RestaurantImage({imageID: result.insertId, restaurantID, imageURL});
    }
    
    static async deleteImage(imageID){
        const [result] = await db.query(
            `DELETE FROM RestaurantImage WHERE imageID = ?`,
            [imageID]
        );
        return result.affectedRows > 0;
    }
}

export default RestaurantImageDAO;