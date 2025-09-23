import RestaurantDAO from "../dao/RestaurantDAO.js";

class RestaurantController {
  static async getAll(req, res) {
    try {
      const data = await RestaurantDAO.getAll();
      res.json(data);
    } catch (err) {
      res
        .status(500).json({ message: "Error fetching Restaurant", error: err.message });
    }
  }

  static async getAllByOwnerID(req,res){
    try{
      const {ownerID} = req.params;
      const restaurants = await RestaurantDAO.getAllByOwnerID(ownerID);
      res.json(restaurants);
    }catch(err){
      res.status(500).json({message: "Error fetching restaurant",error: err.message});
    }
  }

  static async getById(req, res) {
    try {
      const restaurant = await RestaurantDAO.getById(req.params.id);
      if (!restaurant)
        return res.status(404).json({ message: "Restaurant not found" });
      res.json(restaurant);
    } catch (err) {
      res.status(500).json({ message: "Error fetching restaurant", error: err.message });
    }
  }

  static async createRestaurant(req, res) {
    try {
      const newRestaurant = await RestaurantDAO.createRestaurant(req.body);
      res.status(201).json(newRestaurant);
    } catch (err) {
      res.status(500).json({ message: "Error creating restaurant", error: err.message });
    }
  }

  static async updateRestaurant(req, res) {
    try {
      const updated = await RestaurantDAO.updateRestaurant(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Error updating restaurant", error: err.message });
    }
  }

  static async deleteRestaurant(req, res) {
    try {
      const success = await RestaurantDAO.deleteRestaurant(req.params.id);
      if (!success) return res.status(404).json({ message: "Restaurant not found" });
      res.status(204).end(); // no content
    } catch (err) {
      res.status(500).json({ message: "Error deleting restaurant", error: err.message });
    }
  }

}

export default RestaurantController;