import db from "../config/db.js";
import hallimage from "../models/hallimage.cjs";
const { HallImage,sequelize } = db;
class HallImageDAO {
    static async createHallImage(hallID, imageURL) {
        const result = await HallImage.create({ hallID, imageURL });
        return new HallImage({ imageID: result.insertId, hallID, imageURL });
    }
    static async getByHallId(hallID) {
        const rows = await HallImage.findAll({ where: { hallID } });
        return rows.map(row => new HallImage(row));
    }
    static async deleteHallImage(imageID) {
        const count = await HallImage.destroy({ where: { imageID } });
        return count > 0;
    }
}
export default HallImageDAO;