import db from "../config/db.js";
import { toDTO, toDTOs } from '../utils/convert/dto.js';
const { dishcategory } = db;

class DishCategoryDAO {
    static async getAll() {
        const rows = await dishcategory.findAll({ attributes: ['dishCategoryID', 'name', 'description'] });
        return toDTOs(rows);
    }
    static async getByID(dishCategoryID) {
        const r = await dishcategory.findByPk(dishCategoryID, { attributes: ['dishCategoryID', 'name', 'description'] });
        return toDTO(r);
    }
    static async addDishCategory(name, description) {
        const dc = await dishcategory.create({ name, description });
        return toDTO(dc);
    }
    static async updateDishCategory(dishCategoryID, dishCategoryData) {
        const [count] = await dishcategory.update(dishCategoryData, { where: { dishCategoryID } });
        return count > 0;
    }
    static async deleteDishCategory(dishCategoryID) {
        const count = await dishcategory.destroy({ where: { dishCategoryID } });
        return count > 0;
    }
}
export default DishCategoryDAO;