import db from "../config/db.js";
import { Op } from 'sequelize';
import { toDTO, toDTOs } from '../utils/convert/dto.js';
const { amenity, sequelize, restaurantamenities } = db;

class AmenityDAO {
    static async getAll() {
        const rows = await amenity.findAll({
            attributes: ['amenityID', 'name']
        });
        return toDTOs(rows);
    }
    static async getByID(amenityID) {
        const r = await amenity.findByPk(amenityID, {
            attributes: ['amenityID', 'name']
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
            attributes: ['amenityID', 'name']
        });
        return toDTOs(rows);
    }
    static async addAmenity(name, description) {
        const a = await amenity.create({ name, description });
        return toDTO(a);
    }

    static async addAmenityToRestaurant(restaurantID, amenityID) {
        // ignore duplicates by finding or creating
        const [link, created] = await restaurantamenities.findOrCreate({ where: { restaurantID, amenityID }, defaults: { restaurantID, amenityID } });
        return !!link;
    }

    static async removeAmenityFromRestaurant(restaurantID, amenityID) {
        const count = await restaurantamenities.destroy({ where: { restaurantID, amenityID } });
        return count > 0;
    }
}
export default AmenityDAO;