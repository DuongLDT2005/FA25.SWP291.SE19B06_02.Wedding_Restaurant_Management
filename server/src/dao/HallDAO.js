
import db from "../config/db.js";

// Use Sequelize models from init-models
const { sequelize, hall, restaurant } = db;

class HallDAO {
    static async createHall(hallData) {
        const {
            restaurantID,
            name,
            description,
            capacity, // legacy field -> map to maxTable
            minTable,
            maxTable,
            area,
            price,
            status
        } = hallData;

        return await sequelize.transaction(async (t) => {
            const newHall = await hall.create({
                restaurantID,
                name,
                description,
                minTable: typeof minTable === 'number' ? minTable : undefined,
                maxTable: typeof maxTable === 'number' ? maxTable : (typeof capacity === 'number' ? capacity : undefined),
                area,
                price,
                status
            }, { transaction: t });

            // increment hallCount on restaurant
            await restaurant.increment('hallCount', { by: 1, where: { restaurantID }, transaction: t });

            return newHall;
        });
    }

    static async getHallById(hallID) {
        const h = await hall.findByPk(hallID);
        if (!h) return null;
        // Provide a plain object with a legacy 'capacity' field mapped from maxTable
        const json = h.toJSON();
        return { ...json, capacity: json.maxTable };
    }

    static async getHallsByRestaurantId(restaurantID) {
        const rows = await hall.findAll({ where: { restaurantID } });
        return rows.map(h => {
            const json = h.toJSON();
            return { ...json, capacity: json.maxTable };
        });
    }

    static async updateHall(hallID, hallData) {
        const data = { ...hallData };
        // Map legacy capacity to maxTable if provided
        if (typeof hallData.capacity === 'number' && data.maxTable === undefined) {
            data.maxTable = hallData.capacity;
            delete data.capacity;
        }
        await hall.update(data, { where: { hallID } });
    }

    static async deleteHall(hallID) {
        return await sequelize.transaction(async (t) => {
            const h = await hall.findByPk(hallID, { transaction: t, attributes: ['hallID','restaurantID'] });
            if (!h) return false;
            const rId = h.restaurantID;

            const count = await hall.destroy({ where: { hallID }, transaction: t });
            if (!count) return false;

            // decrement hallCount but do not go below 0
            await restaurant.update(
                { hallCount: sequelize.literal('CASE WHEN hallCount > 0 THEN hallCount - 1 ELSE 0 END') },
                { where: { restaurantID: rId }, transaction: t }
            );
            return true;
        });
    }

    static async updateHallStatus(hallID, status) {
        const [affected] = await hall.update({ status }, { where: { hallID } });
        return affected > 0;
    }
}

export default HallDAO;