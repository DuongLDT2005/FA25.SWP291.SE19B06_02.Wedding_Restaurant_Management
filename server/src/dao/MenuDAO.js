import db from "../config/db.js";
import { Op } from 'sequelize';
import { toDTO, toDTOs } from '../utils/convert/dto.js';

// Models from init-models.cjs (lowercase keys)
const { menu, dishmenu, dish, sequelize } = db;

export default class MenuDAO {
    // CRUD for Menu
    static async getByRestaurantID(restaurantID, { onlyActive } = {}) {
        const where = { restaurantID };
        if (onlyActive) where.status = true;
        const rows = await menu.findAll({
            where,
            attributes: ['menuID','restaurantID','name','price','imageURL','status'],
            order: [['menuID','ASC']]
        });
        return toDTOs(rows);
    }

    static async getByID(menuID, { includeDishes = true } = {}) {
        const include = [];
        if (includeDishes) {
            include.push({
                model: dish,
                as : 'dishes',
                attributes: ['dishID','restaurantID','name','imageURL','categoryID'],
                through: { attributes: [] }
            });
        }
        const r = await menu.findByPk(menuID, {
            attributes: ['menuID','restaurantID','name','price','imageURL','status'],
            include
        });
        return toDTO(r);
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
        const rows = await dishmenu.findAll({ where: { dishID }, attributes: ['menuID','dishID'] });
        return toDTOs(rows);
    }
    static async addDishMenu(dishID, menuID) {
        const dm = await dishmenu.create({ dishID, menuID }); 
        return { menuID: dm.menuID, dishID: dm.dishID };
    }

}