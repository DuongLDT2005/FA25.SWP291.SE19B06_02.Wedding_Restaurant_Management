import RestaurantService from "../services/RestaurantService.js";

class RestaurantController {
  static async getAll(req, res) {
    try {
      const data = await RestaurantService.getAll();
      res.json(data);
    } catch (err) {
      res
        .status(500).json({ message: "Error fetching Restaurant", error: err.message });
    }
  }

  static async getByPartner(req,res){
    try{
      const {partnerID} = req.params;
      const restaurants = await RestaurantService.getByPartnerID(partnerID);
      res.json(restaurants);
    }catch(err){
      res.status(500).json({message: "Error fetching restaurant",error: err.message});
    }
  }

  static async getOne(req, res) {
    try {
      const restaurant = await RestaurantService.getByID(req.params.id);
      if (!restaurant)
        return res.status(404).json({ message: "Restaurant not found" });
      res.json(restaurant);
    } catch (err) {
      res.status(500).json({ message: "Error fetching restaurant", error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newRestaurant = await RestaurantService.create(req.body);
      res.status(201).json(newRestaurant);
    } catch (err) {
      res.status(500).json({ message: "Error creating restaurant", error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await RestaurantService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Error updating restaurant", error: err.message });
    }
  }

  static async changeRestaurantStatus(req, res) {
    try {
      const success = await RestaurantService.changeRestaurantStatus(req.params.id);
      if (!success) return res.status(404).json({ message: "Restaurant not found" });
      res.status(201).end();
    } catch (err) {
      res.status(500).json({ message: "Error deleting restaurant", error: err.message });
    }
  }

  static async addImage(req,res){
    try{
      const {id} = req.params;
      const {imageURL} = req.body;
      const image = await RestaurantService.addImage(id,imageURL);
      res.status(201).json(image);
    }catch(err){
      res.status(500).json({ error : err.message});
    }
  }
  
  static async deleteImage(req,res){
    try{
      const {imageID} = req.params;
      const success = await RestaurantService.deleteImage(imageID);
      if(!success) return res.status(500).json({message: "Image not found"});
      res.json("Success");
    }catch(err){
      res.status(500).json({error : err.message});
    }
  }

  static async search(req,res){
    try{
      const  {location,capacity,date,minPrice,maxPrice} = req.query;

      const results = await RestaurantService.search({
        location,
        capacity : capacity ? parseInt(capacity) : null,
        date,
        minPrice : minPrice ? parseFloat(minPrice) : null,
        maxPrice : maxPrice ? parseFloat(maxPrice) : null,
      });
      res.json(results)
    }catch(err){
      res.status(500).json({message : "Error searching restaurants", error : err.message});
    }
  }

}

export default RestaurantController;