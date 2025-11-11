import AmenityServices from "../services/AmenityServices.js";

class AmenityController {
  static async getAll(req, res) {
    try {
      const amenities = await AmenityServices.getAll();
      res.json(amenities);
    } catch (err) {
      console.error("Error fetching amenities:", err);
      res.status(500).json({ message: "Error fetching amenities", error: err.message });
    }
  }

  static async getByID(req, res) {
    try {
      const { id } = req.params;
      const amenity = await AmenityServices.getByID(id);
      if (!amenity)
        return res.status(404).json({ message: "Amenity not found" });
      res.json(amenity);
    } catch (err) {
      res.status(500).json({ message: "Error fetching amenity", error: err.message });
    }
  }

  static async getByRestaurant(req, res) {
    try {
      const { restaurantID } = req.params;
      const amenities = await AmenityServices.getAmenitiesByRestaurant(restaurantID);
      res.json(amenities);
    } catch (err) {
      res.status(500).json({ message: "Error fetching restaurant amenities", error: err.message });
    }
  }
}

export default AmenityController;
