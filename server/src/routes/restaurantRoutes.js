import express from "express";
import RestaurantController from "../controllers/RestaurantController.js";

const router = express.Router();

//Restaurants
router.get("/partner/:partnerID",RestaurantController.getByPartner);
router.get("/search",RestaurantController.search);
router.get("/", RestaurantController.getAll);
router.get("/:id", RestaurantController.getOne); //GetByID
router.post("/",RestaurantController.create);
router.put("/:id",RestaurantController.update);
router.delete("/:id",RestaurantController.changeRestaurantStatus);

//Restaurant Images
router.post("/:id/images", RestaurantController.addImage);
router.delete("/images/:imageID", RestaurantController.deleteImage);

export default router;
