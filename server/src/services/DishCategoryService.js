import DishCategoryDAO from '../dao/DishCategoryDAO.js';
import RestaurantDAO from '../dao/RestaurantDAO.js';

class DishCategoryService {
  static async createForPartner(actorUserId, { name, description, restaurantID }) {
    if (!restaurantID) throw new Error('restaurantID required');
    const r = await RestaurantDAO.getByID(restaurantID);
    if (!r) throw new Error('Restaurant not found');
    if (String(r.restaurantPartnerID) !== String(actorUserId)) throw new Error('Not authorized');

    return await DishCategoryDAO.addDishCategory(name, description, restaurantID);
  }

  static async updateForPartner(actorUserId, dishCategoryID, patch) {
    const dc = await DishCategoryDAO.getByID(dishCategoryID);
    if (!dc) throw new Error('DishCategory not found');
    const r = await RestaurantDAO.getByID(dc.restaurantID);
    if (!r) throw new Error('Restaurant not found');
    if (String(r.restaurantPartnerID) !== String(actorUserId)) throw new Error('Not authorized');

    await DishCategoryDAO.updateDishCategory(dishCategoryID, patch);
    return await DishCategoryDAO.getByID(dishCategoryID);
  }

  static async deleteForPartner(actorUserId, dishCategoryID) {
    const dc = await DishCategoryDAO.getByID(dishCategoryID);
    if (!dc) throw new Error('DishCategory not found');
    const r = await RestaurantDAO.getByID(dc.restaurantID);
    if (!r) throw new Error('Restaurant not found');
    if (String(r.restaurantPartnerID) !== String(actorUserId)) throw new Error('Not authorized');

    return await DishCategoryDAO.deleteDishCategory(dishCategoryID);
  }

  static async listByRestaurant(restaurantID) {
    const all = await DishCategoryDAO.getAll();
    return all.filter(dc => String(dc.restaurantID) === String(restaurantID));
  }
}

export default DishCategoryService;
