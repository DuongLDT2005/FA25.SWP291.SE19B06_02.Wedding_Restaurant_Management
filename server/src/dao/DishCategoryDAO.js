import db from "../config/db";
const { dishcategory } = db;

class DishCategoryDAO {
    static async getAll() {
        return await dishcategory.findAll({ attributes: ['dishCategoryID', 'name', 'description'] });
    }
    static async getByID(dishCategoryID) {
        return await dishcategory.findByPk(dishCategoryID, { attributes: ['dishCategoryID', 'name', 'description'] });
    }
    static async addDishCategory(name, description) {
        const dc = await dishcategory.create({ name, description });
        // Return a plain shape like before
        return { dishCategoryID: dc.dishCategoryID, name: dc.name, description: dc.description };
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