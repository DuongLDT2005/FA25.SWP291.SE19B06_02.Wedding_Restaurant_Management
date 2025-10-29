
import db from "../config/db.js";
import { toDTO, toDTOs } from '../utils/dto.js';

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

            const dto = toDTO(newHall);
            // provide legacy capacity mapping
            return { ...dto, capacity: dto.maxTable };
        });
    }

    static async getHallById(hallID) {
        const h = await hall.findByPk(hallID);
        if (!h) return null;
        const dto = toDTO(h);
        return { ...dto, capacity: dto.maxTable };
    }

    static async getHallsByRestaurantId(restaurantID) {
        const rows = await hall.findAll({ where: { restaurantID } });
        const dtos = toDTOs(rows);
        return dtos.map(d => ({ ...d, capacity: d.maxTable }));
    }

    static async updateHall(hallID, hallData) {
        const data = { ...hallData };
        // Map legacy capacity to maxTable if provided
        if (typeof hallData.capacity === 'number' && data.maxTable === undefined) {
            data.maxTable = hallData.capacity;
            delete data.capacity;
        }
        const [count] = await hall.update(data, { where: { hallID } });
        return count > 0;
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