import db from "../config/db";
const {dish} = db;

class DishDAO {
    static async getByRestaurantID(restaurantID) {
        return await dish.findAll({ where: { restaurantID }, attributes: ['dishID','restaurantID','name','description','price','imageURL'] });
    }
    static async getByID(dishID) {
        return await dish.findByPk(dishID, { attributes: ['dishID','restaurantID','name','description','price','imageURL'] });
    }
    static async addDish(restaurantID, name, description, price, imageURL) {
        const d = await dish.create({ restaurantID, name, description, price, imageURL });
        // Return a plain shape like before
        return { dishID: d.dishID, restaurantID: d.restaurantID, name: d.name, description: d.description, price: d.price, imageURL: d.imageURL };
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