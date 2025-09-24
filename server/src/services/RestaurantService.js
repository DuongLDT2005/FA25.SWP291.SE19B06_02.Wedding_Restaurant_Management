import RestaurantDAO from "../dao/RestaurantDAO.js";

class RestaurantService {
  static async getAllRestaurants() {
    return await RestaurantDAO.getAll();
  }

  static async getRestaurantByOwnerID(ownerID) {
    return await RestaurantDAO.getAllByOwnerID(ownerID);
  }

  static async getRestaurantByID(id) {
    return await RestaurantDAO.getByID(id);
  }

  static async createRestaurant(data) {
    if (!data.name || !data.ownerID) {
      throw new Error("Restaurant name and ownerID are required");
    }
    return await RestaurantDAO.createRestaurant(data);
  }

  static async updateRestaurant(id, data){
    return await RestaurantDAO.updateRestaurant(id, data);
  }

  static async deleteRestaurant(id) {
    return await RestaurantDAO.deleteRestaurant(id);
  }

}

export default RestaurantService;