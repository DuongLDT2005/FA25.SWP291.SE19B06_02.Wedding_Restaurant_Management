import PromotionDAO from '../dao/PromotionDAO.js';
import RestaurantDAO from '../dao/RestaurantDAO.js';
import db from '../config/db.js';

class PromotionService {
  static async createPromotionForPartner(actorUserId, data) {
    const { title, description, discountPercentage, startDate, endDate, restaurantID, discountType, serviceIDs } = data;
    if (!restaurantID) throw new Error('restaurantID required');
    const r = await RestaurantDAO.getByID(restaurantID);
    if (!r) throw new Error('Restaurant not found');
    if (String(r.restaurantPartnerID) !== String(actorUserId)) throw new Error('Not authorized');

    return await PromotionDAO.addPromotion(title, description, discountPercentage, startDate, endDate, restaurantID, discountType, serviceIDs);
  }

  static async updateForPartner(actorUserId, promotionID, patch) {
    const existing = await PromotionDAO.getByID(promotionID);
    if (!existing) throw new Error('Promotion not found');
    // ensure this promotion is linked to a restaurant owned by actorUserId
    const { restaurantpromotion } = db;
    const link = await restaurantpromotion.findOne({ where: { promotionID } });
    if (!link) throw new Error('Promotion not linked to any restaurant');
    const restaurantID = link.restaurantID;
    const r = await RestaurantDAO.getByID(restaurantID);
    if (!r) throw new Error('Restaurant not found');
    if (String(r.restaurantPartnerID) !== String(actorUserId)) throw new Error('Not authorized');

    const ok = await PromotionDAO.updatePromotion(promotionID, patch);
    if (!ok) throw new Error('Update failed');
    return await PromotionDAO.getByID(promotionID);
  }

  static async deleteForPartner(actorUserId, promotionID) {
    const existing = await PromotionDAO.getByID(promotionID);
    if (!existing) throw new Error('Promotion not found');
    const { restaurantpromotion } = db;
    const link = await restaurantpromotion.findOne({ where: { promotionID } });
    if (!link) throw new Error('Promotion not linked to any restaurant');
    const restaurantID = link.restaurantID;
    const r = await RestaurantDAO.getByID(restaurantID);
    if (!r) throw new Error('Restaurant not found');
    if (String(r.restaurantPartnerID) !== String(actorUserId)) throw new Error('Not authorized');

    const ok = await PromotionDAO.deletePromotion(promotionID);
    if (!ok) throw new Error('Delete failed');
    return true;
  }

  static async listForRestaurant(restaurantID) {
    return await PromotionDAO.getPromotionsByRestaurantID(restaurantID);
  }
}

export default PromotionService;
