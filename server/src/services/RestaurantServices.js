import RestaurantDAO from "../dao/RestaurantDAO.js";
import RestaurantImageDAO from "../dao/RestaurantImageDAO.js";

class RestaurantService {
  static async getAll() {
    return await RestaurantDAO.getAll();
  }

  static async getByPartnerID(restaurantPartnerID) {
    return await RestaurantDAO.getAllByPartnerID(restaurantPartnerID);
  }

  static async getAvailable() {
    return await RestaurantDAO.getAvailable();
  }

  static async getByID(restaurantID) {
    return await RestaurantDAO.getByID(restaurantID);
  }

  static async create(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid payload");
    }
    const { name, restaurantPartnerID, address, thumbnailURL } = data;
    if (!name || !restaurantPartnerID) {
      throw new Error("Restaurant name and restaurantPartnerID are required");
    }
    if (!thumbnailURL || typeof thumbnailURL !== "string") {
      throw new Error("thumbnailURL is required");
    }
    if (!address || typeof address !== "object") {
      throw new Error("address is required with { number, street, ward }");
    }
    const { number, street, ward } = address;
    if (!number || !street || !ward) {
      throw new Error(
        "address.number, address.street and address.ward are required"
      );
    }
    return await RestaurantDAO.createRestaurant(data);
  }

  static async update(restaurantID, data) {
    return await RestaurantDAO.updateRestaurant(restaurantID, data);
  }

  static async changeRestaurantStatus(id) {
    return await RestaurantDAO.toggleRestaurantStatus(id);
  }

  static async addImage(restaurantID, imageURL) {
    if (!restaurantID) throw new Error("restaurantID is required");
    if (!imageURL || typeof imageURL !== "string")
      throw new Error("imageURL is required");
    return await RestaurantImageDAO.addImage(restaurantID, imageURL);
  }

  static async deleteImage(imageID) {
    if (!imageID) throw new Error("imageID is required");
    return await RestaurantImageDAO.deleteImage(imageID);
  }

  static async search(filter) {
    console.log("🔧 [RestaurantService] Final search filter:", filter);
    return await RestaurantDAO.search(filter);
  }
}

export default RestaurantService;
