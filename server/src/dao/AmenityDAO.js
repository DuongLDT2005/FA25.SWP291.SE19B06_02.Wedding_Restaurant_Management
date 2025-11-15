import db from "../config/db.js";
import { Op } from 'sequelize';
import { toDTO, toDTOs } from '../utils/convert/dto.js';

const { amenity, restaurantamenities } = db;

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
    const amenityLinks = await restaurantamenities.findAll({
      where: { restaurantID },
      attributes: ['amenityID']
    });
    const amenityIDs = amenityLinks.map(link => link.amenityID);
    if (amenityIDs.length === 0) return [];

    const rows = await amenity.findAll({
      where: { amenityID: { [Op.in]: amenityIDs } },
      attributes: ['amenityID', 'name']
    });
    return toDTOs(rows);
  }
}

export default AmenityDAO;
