import RestaurantDAO from "../dao/RestaurantDAO.js";
import RestaurantImageDAO from "../dao/RestaurantImageDAO.js";
import AddressDAO from "../dao/AddressDAO.js";

class RestaurantService {
  static async getAll() {
    return await RestaurantDAO.getAll();
  }

  static async getByOwnerID(ownerID) {
    return await RestaurantDAO.getAllByOwnerID(ownerID);
  }

  static async getByID(restaurantID) {
    return await RestaurantDAO.getByID(restaurantID);
  }

  static async create(data) {
    if (!data.name || !data.restaurantPartnerID) {
      throw new Error("Restaurant name and restaurantPartnerID are required");
    }
    return await RestaurantDAO.createRestaurant(data);
  }

  static async update(restaurantID, data){
    return await RestaurantDAO.updateRestaurant(restaurantID, data);
  }

  static async changeRestaurantStatus(id) {
    return await RestaurantDAO.toggleRestaurantStatus(id);
  }

  static async addImage(restaurantID, imageURL){
    return await RestaurantImageDAO.addImage(restaurantID, imageURL);
  }

  static async deleteImage(imageID){
    return await RestaurantImageDAO.deleteImage(imageID);
  }
}

export default RestaurantService;