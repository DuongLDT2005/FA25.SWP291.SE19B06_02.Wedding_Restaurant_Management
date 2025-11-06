import db from "../config/db.js";
import { Op } from 'sequelize';
import { toDTO, toDTOs } from '../utils/convert/dto.js';
const { service, sequelize, restauranteventtype } = db;

class ServiceDAO {
    static async getAll() {
        const rows = await service.findAll({
            attributes: ['serviceID', 'name', 'description', 'price']
        });
        return toDTOs(rows);
    }
    static async getByID(serviceID) {
        const r = await service.findByPk(serviceID, {
            attributes: ['serviceID', 'name', 'description', 'price']
        });
        return toDTO(r);
    }
    static async addService(name, description, price) {
        const s = await service.create({ name, description, price });
        return toDTO(s);
    }
    static async updateService(serviceID, serviceData) {
        const [count] = await service.update(serviceData, { where: { serviceID } });
        return count > 0;
    }
    static async deleteService(serviceID) {
        const count = await service.destroy({ where: { serviceID } });
        return count > 0;
    }
    static async getServicesByEventType(eventTypeID, restaurantID = null) {
        // First, find all serviceIDs linked to the given eventTypeID
        const eventTypeLinks = await restauranteventtype.findAll({
            where: {
                eventTypeID,
                ...(restaurantID && { restaurantID })
            },
            attributes: ['serviceID']
        });
        const serviceIDs = eventTypeLinks.map(link => link.serviceID);
        if (serviceIDs.length === 0) {
            return [];
        }
        // Now, fetch all services with these serviceIDs
        const rows = await service.findAll({
            where: {
                serviceID: {
                    [Op.in]: serviceIDs
                }
            },
            attributes: ['serviceID', 'name', 'description', 'price']
        });
        return toDTOs(rows);
    }
    static async getByRestaurantID(restaurantID) {
        const rows = await service.findAll({ where: { restaurantID }, attributes: ['serviceID', 'name', 'description', 'price'] });
        return toDTOs(rows);
    }
}
export default ServiceDAO;