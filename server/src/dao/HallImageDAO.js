import db from "../config/db.js";
class HallImageDAO {
    static async createHallImage(hallID, imageURL) {
        const [result] = await db.query(
            `INSERT INTO HallImage (hallID, imageURL) VALUES (?, ?)`,
            [hallID, imageURL]
        );
        return new HallImage({ imageID: result.insertId, hallID, imageURL });
    }
    static async getByHallId(hallID) {
        const [rows] = await db.query(
            `SELECT imageID, hallID, imageURL FROM HallImage WHERE hallID = ?`,
            [hallID]
        );
        return rows.map(row => new HallImage(row));
    }
    static async deleteHallImage(imageID) {
        await db.query(
            `DELETE FROM HallImage WHERE imageID = ?`,
            [imageID]
        );
    }
}
export default HallImageDAO;