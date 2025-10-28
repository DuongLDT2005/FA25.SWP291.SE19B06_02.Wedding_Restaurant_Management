import db from "../config/db.js";
import { Op } from 'sequelize';

// Models from init-models.cjs (lowercase keys)
const { menu, dishmenu, dish, sequelize } = db;

export default class MenuDAO {
    // CRUD for Menu
    static async getByRestaurantID(restaurantID, { onlyActive } = {}) {
        const where = { restaurantID };
        if (onlyActive) where.status = true;
        return await menu.findAll({
            where,
            attributes: ['menuID','restaurantID','name','price','imageURL','status'],
            order: [['menuID','ASC']]
        });
    }

    static async getByID(menuID, { includeDishes = true } = {}) {
        const include = [];
        if (includeDishes) {
            // Use the belongsToMany association; alias may be long, so include through directly
            include.push({
                model: dish,
                // rely on auto alias from init-models; through ensures join without extra attrs
                through: { attributes: [] },
                attributes: ['dishID','restaurantID','name','imageURL','categoryID','price']
            });
        }
        return await menu.findByPk(menuID, {
            attributes: ['menuID','restaurantID','name','price','imageURL','status'],
            include
        });
    }

    static async createMenu({ restaurantID, name, price, imageURL, status = true, dishIDs = [] }) {
        return await sequelize.transaction(async (t) => {
            const m = await menu.create({ restaurantID, name, price, imageURL, status }, { transaction: t });

            if (dishIDs && dishIDs.length) {
                // Validate dishes belong to the same restaurant
                const rows = await dish.findAll({
                    where: { dishID: { [Op.in]: dishIDs }, restaurantID },
                    attributes: ['dishID'],
                    transaction: t
                });
                const foundIDs = new Set(rows.map(r => r.dishID));
                const missing = dishIDs.filter(id => !foundIDs.has(id));
                if (missing.length) {
                    throw new Error(`Some dishes do not belong to restaurant ${restaurantID}: [${missing.join(', ')}]`);
                }
                // Bulk link
                const bulk = dishIDs.map(dishID => ({ menuID: m.menuID, dishID }));
                await dishmenu.bulkCreate(bulk, { transaction: t, ignoreDuplicates: true });
            }

            return { menuID: m.menuID, restaurantID: m.restaurantID, name: m.name, price: m.price, imageURL: m.imageURL, status: m.status };
        });
    }

    static async updateMenu(menuID, patch) {
        const { name, price, imageURL, status } = patch;
        const [count] = await menu.update(
            { name, price, imageURL, status },
            { where: { menuID } }
        );
        return count > 0;
    }

    static async deleteMenu(menuID) {
        const count = await menu.destroy({ where: { menuID } });
        return count > 0;
    }

    static async getByDishID(dishID) {
        return await dishmenu.findAll({ where: { dishID }, attributes: ['menuID','dishID'] });
    }
    static async addDishMenu(dishID, menuID) {
        const dm = await dishmenu.create({ dishID, menuID }); 
        return { menuID: dm.menuID, dishID: dm.dishID };
    }

}