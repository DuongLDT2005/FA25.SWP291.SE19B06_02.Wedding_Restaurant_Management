import db from "../config/db.js";
import { Op } from 'sequelize';
import { toDTO, toDTOs } from '../utils/convert/dto.js';
import MenuDAO from './MenuDAO.js';
import DishDAO from './DishDAO.js';
import PromotionDAO from './PromotionDAO.js';
import ServiceDAO from './ServiceDAO.js';
import HallDAO from './HallDAO.js';

// Models from init-models.cjs
const { sequelize, restaurant, restaurantimage, address, hall, booking } = db;

class RestaurantDAO {
  static async getAll() {
    const rows = await restaurant.findAll({
      attributes: ['restaurantID','restaurantPartnerID','name','description','hallCount','addressID','thumbnailURL','status'],
      include: [{ model: address, as: 'address', attributes: ['fullAddress'] }],
      order: [['restaurantID','ASC']]
    });
    const dtos = toDTOs(rows);
    return dtos.map(r => ({
      restaurantID: r.restaurantID,
      restaurantPartnerID: r.restaurantPartnerID,
      name: r.name,
      description: r.description,
      hallCount: r.hallCount,
      addressID: r.addressID,
      thumbnailURL: r.thumbnailURL,
      status: r.status,
      address: r.address?.fullAddress || null,
    }));
  }

  static async getAvailable(){
    const rows = await restaurant.findAll({
      where: { status: true },
      attributes: ['restaurantID','restaurantPartnerID','name','description','hallCount','addressID','thumbnailURL','status'],
      include: [{ model: address, as: 'address', attributes: ['fullAddress'] }]
    });
    const dtos = toDTOs(rows);
    return dtos.map(r => ({
      restaurantID: r.restaurantID,
      restaurantPartnerID: r.restaurantPartnerID,
      name: r.name,
      description: r.description,
      hallCount: r.hallCount,
      addressID: r.addressID,
      thumbnailURL: r.thumbnailURL,
      status: r.status,
      address: r.address?.fullAddress || null,
    }));
  }

  static async getAllByPartnerID(restaurantPartnerID) {
    const rows = await restaurant.findAll({
      where: { restaurantPartnerID },
      attributes: ['restaurantID','restaurantPartnerID','name','description','hallCount','addressID','thumbnailURL','status'],
      include: [{ model: address, as: 'address', attributes: ['fullAddress'] }]
    });
    const dtos = toDTOs(rows);
    return dtos.map(r => ({
      restaurantID: r.restaurantID,
      restaurantPartnerID: r.restaurantPartnerID,
      name: r.name,
      description: r.description,
      hallCount: r.hallCount,
      addressID: r.addressID,
      thumbnailURL: r.thumbnailURL,
      status: r.status,
      address: r.address?.fullAddress || null,
    }));
  }

  static async getByID(restaurantID) {
    const r = await restaurant.findByPk(restaurantID, {
      attributes: ['restaurantID','restaurantPartnerID','name','description','hallCount','addressID','thumbnailURL','status'],
      include: [
        { model: address, as: 'address', attributes: ['fullAddress'] },
        { model: restaurantimage, as: 'restaurantimages', attributes: ['imageID','imageURL'] }
      ]
    });
    if (!r) return null;
    const dto = toDTO(r);
    // fetch related collections (menus, dishes, promotions, services)
    const [menus, dishes, promotions, services, halls] = await Promise.all([
      MenuDAO.getByRestaurantID(restaurantID).catch(() => []),
      DishDAO.getByRestaurantID(restaurantID).catch(() => []),
      PromotionDAO.getPromotionsByRestaurantID(restaurantID).catch(() => []),
      ServiceDAO.getByRestaurantID(restaurantID).catch(() => []),
      HallDAO.getHallsByRestaurantId(restaurantID).catch(() => [])
    ]);

    return {
      restaurantID: dto.restaurantID,
      restaurantPartnerID: dto.restaurantPartnerID,
      name: dto.name,
      description: dto.description,
      hallCount: dto.hallCount,
      addressID: dto.addressID,
      thumbnailURL: dto.thumbnailURL,
      status: dto.status,
      address: dto.address?.fullAddress || null,
      images: (dto.restaurantimages || []).map(img => ({ imageID: img.imageID, imageURL: img.imageURL })),
      menus,
      dishes,
      promotions,
      services,
      halls
    };
  }

  static async getSummaryByID(restaurantID) {
    // Return a lighter-weight representation suitable for listing or small detail views
    const r = await restaurant.findByPk(restaurantID, {
      attributes: ['restaurantID','restaurantPartnerID','name','description','hallCount','addressID','thumbnailURL','status'],
      include: [{ model: address, as: 'address', attributes: ['fullAddress'] }]
    });
    if (!r) return null;
    const dto = toDTO(r);
    return {
      restaurantID: dto.restaurantID,
      name: dto.name,
      description: dto.description,
      hallCount: dto.hallCount,
      thumbnailURL: dto.thumbnailURL,
      status: dto.status,
      address: dto.address?.fullAddress || null,
    };
  }
  /* 
constructor({
    restaurantID,
    restaurantPartnerID,
    name,
    description,
    hallCount,
    addressID,
    thumbnailURL,
    status,
  }) {*/
  static async createRestaurant({
    restaurantPartnerID,
    name,
    description,
    address: addr,
    thumbnailURL,
    status,
  }) {
    return await sequelize.transaction(async (t) => {
      const a = await address.create({
        number: addr.number,
        street: addr.street,
        ward: addr.ward,
        // fullAddress could be generated by a trigger; leave null if DB handles it
      }, { transaction: t });

      const r = await restaurant.create({
        restaurantPartnerID,
        name,
        description,
        addressID: a.addressID,
        thumbnailURL,
        status: status ?? true,
      }, { transaction: t });

      return {
        restaurantID: r.restaurantID,
        restaurantPartnerID: r.restaurantPartnerID,
        name: r.name,
        description: r.description,
        hallCount: r.hallCount ?? 0,
        addressID: r.addressID,
        thumbnailURL: r.thumbnailURL,
        status: r.status,
      };
    });
  }

  static async updateRestaurant(
    restaurantID,
    { restaurantPartnerID, name, description, address: addr, thumbnailURL }
  ) {
    return await sequelize.transaction(async (t) => {
      const r = await restaurant.findByPk(restaurantID, { transaction: t });
      if (!r) throw new Error('Restaurant not found');

      if (addr) {
        await address.update({
          number: addr.number,
          street: addr.street,
          ward: addr.ward,
        }, { where: { addressID: r.addressID }, transaction: t });
      }

      await r.update({
        restaurantPartnerID,
        name,
        description,
        thumbnailURL,
      }, { transaction: t });

      return await this.getByID(restaurantID);
    });
  }

  static async toggleRestaurantStatus(restaurantID) {
    const r = await restaurant.findByPk(restaurantID, { attributes: ['status'] });
    if (!r) return false;
    await r.update({ status: !r.status });
    return true;
  }

  static async search({ location, capacity, date, minPrice, maxPrice }) {
    // Build hall filters
    const hallWhere = { status: true };
    if (capacity) {
      hallWhere.maxTable = { [Op.gte]: capacity };
    }
    if (minPrice || maxPrice) {
      hallWhere.price = {};
      if (minPrice) hallWhere.price[Op.gte] = minPrice;
      if (maxPrice) hallWhere.price[Op.lte] = maxPrice;
    }

    // Exclude halls already booked on date with status = 1
    if (date) {
      const busy = await booking.findAll({
        attributes: ['hallID'],
        where: { eventDate: date, status: 1 },
        raw: true,
      });
      const busyIds = busy.map(b => b.hallID).filter(Boolean);
      if (busyIds.length) {
        hallWhere.hallID = { [Op.notIn]: busyIds };
      }
    }

    const includeAddress = {
      model: address,
      as: 'address',
      attributes: ['fullAddress'],
      ...(location ? { where: { fullAddress: { [Op.like]: `%${location}%` } } } : {})
    };

    const rows = await restaurant.findAll({
      where: { status: true },
      attributes: ['restaurantID','restaurantPartnerID','name','description','hallCount','addressID','thumbnailURL','status'],
      include: [ includeAddress, { model: hall, as: 'halls', attributes: ['hallID','name','price','minTable','maxTable','status'], where: hallWhere, required: true } ],
      order: [['restaurantID','ASC']]
    });
    // Flatten per hall (similar to original DISTINCT join result)
    const plain = toDTOs(rows);
    const results = [];
    for (const r of plain) {
      for (const h of (r.halls || [])) {
        results.push({
          restaurantID: r.restaurantID,
          restaurantPartnerID: r.restaurantPartnerID,
          name: r.name,
          description: r.description,
          hallCount: r.hallCount,
          addressID: r.addressID,
          thumbnailURL: r.thumbnailURL,
          status: r.status,
          fullAddress: r.address?.fullAddress || null,
          hallID: h.hallID,
          hallName: h.name,
          price: h.price,
          minTable: h.minTable,
          maxTable: h.maxTable,
          // Preserve legacy 'capacity' field expected by some callers: map to maxTable
          capacity: h.maxTable,
        });
      }
    }
    return results;
  }

}

export default RestaurantDAO;
