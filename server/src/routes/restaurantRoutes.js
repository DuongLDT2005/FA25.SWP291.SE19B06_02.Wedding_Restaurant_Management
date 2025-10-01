import express from "express";
import RestaurantController from "../controllers/RestaurantController.js";

const router = express.Router();

//Restaurants
router.get("/owner/:ownerID",RestaurantController.getByOwner);
router.get("/", RestaurantController.getAll);
router.get("/:id", RestaurantController.getOne); //GetByID
router.post("/",RestaurantController.create);
router.put("/:id",RestaurantController.update);
router.delete("/:id",RestaurantController.changeRestaurantStatus);

//Restaurant Images
router.post("/:id/images", RestaurantController.addImage);
router.delete("/images/:imageID", RestaurantController.deleteImage);

//address routes

export default router;