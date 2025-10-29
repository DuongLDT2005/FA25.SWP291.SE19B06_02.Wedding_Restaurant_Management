import db from "../config/db";
import { Op } from "sequelize";
import { toDTO, toDTOs } from '../utils/dto.js';
const { eventtype, sequelize, restaurant, restauranteventtype } = db;

class EventTypeDAO {
    static async getAll() {
        const rows = await eventtype.findAll({
            attributes: ['eventTypeID', 'name', 'description']
        });
        return toDTOs(rows);
    }
    static async getByID(eventTypeID) {
        const r = await eventtype.findByPk(eventTypeID, {
            attributes: ['eventTypeID', 'name', 'description']
        });
        return toDTO(r);
    }
    static async getAllByRestaurantID(restaurantID) {
        // First, find all eventTypeIDs linked to the given restaurantID
        const eventTypeLinks = await restauranteventtype.findAll({
            where: { restaurantID },
            attributes: ['eventTypeID']
        });
        const eventTypeIDs = eventTypeLinks.map(link => link.eventTypeID);
        if (eventTypeIDs.length === 0) {
            return [];
        }
        // Now, fetch all event types with these eventTypeIDs
        const rows = await eventtype.findAll({
            where: {
                eventTypeID: {
                    [Op.in]: eventTypeIDs
                }
            },
            attributes: ['eventTypeID', 'name', 'description']
        });
        return toDTOs(rows);
    }
}
export default EventTypeDAO;