import db from "../config/db";
import { Op } from 'sequelize';
import { toDTO, toDTOs } from '../utils/convert/dto.js';
const { amenity, sequelize, restaurantamenities } = db;

class AmenityDAO {
    static async getAll() {
        const rows = await amenity.findAll({
            attributes: ['amenityID', 'name', 'description']
        });
        return toDTOs(rows);
    }
    static async getByID(amenityID) {
        const r = await amenity.findByPk(amenityID, {
            attributes: ['amenityID', 'name', 'description']
        });
        return toDTO(r);
    }
    static async getAmenitiesByRestaurantID(restaurantID) {
        // First, find all amenityIDs linked to the given restaurantID
        const amenityLinks = await restaurantamenities.findAll({
            where: { restaurantID },
            attributes: ['amenityID']
        });
        const amenityIDs = amenityLinks.map(link => link.amenityID);
        if (amenityIDs.length === 0) {
            return [];
        }
        // Now, fetch all amenities with these amenityIDs
        const rows = await amenity.findAll({
            where: {
                amenityID: {
                    [Op.in]: amenityIDs
                }
            },
            attributes: ['amenityID', 'name', 'description']
        });
        return toDTOs(rows);
    }
}
export default AmenityDAO;