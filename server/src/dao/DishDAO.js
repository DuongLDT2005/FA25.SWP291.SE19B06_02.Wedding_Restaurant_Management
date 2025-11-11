import db from "../config/db.js";
import { toDTO, toDTOs } from '../utils/convert/dto.js';
const {dish} = db;

class DishDAO {
    static async getByRestaurantID(restaurantID) {
        const rows = await dish.findAll({ where: { restaurantID }, attributes: ['dishID','restaurantID','name','description','price','imageURL'] });
        return toDTOs(rows);
    }
    static async getByID(dishID) {
        const r = await dish.findByPk(dishID, { attributes: ['dishID','restaurantID','name','description','price','imageURL'] });
        return toDTO(r);
    }
    static async addDish(restaurantID, name, description, price, imageURL) {
        const d = await dish.create({ restaurantID, name, description, price, imageURL });
        return toDTO(d);
    }
    
    static async updateDish(dishID, dishData) {
        const [count] = await dish.update(dishData, { where: { dishID } });
        return count > 0;
    }
    static async deleteDish(dishID) {
        const count = await dish.destroy({ where: { dishID } });
        return count > 0;
    }
}
export default DishDAO;