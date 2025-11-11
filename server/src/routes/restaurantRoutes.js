import express from "express";
import RestaurantController from "../controllers/RestaurantController.js";
const router = express.Router();

router.get("/", RestaurantController.getAll);
router.get("/available", RestaurantController.getAvailable);
router.get("/partner/:partnerID", RestaurantController.getByPartner);
router.get("/search", RestaurantController.search);
router.get("/:id", RestaurantController.getOne);

router.post("/", RestaurantController.create);
router.put("/:id", RestaurantController.update);
router.patch("/:id/status", RestaurantController.changeRestaurantStatus);

router.post("/:id/images", RestaurantController.addImage);
router.delete("/images/:imageID", RestaurantController.deleteImage);

// Top booked restaurants (mounted at /api/restaurants/top-booked)
router.get("/top-booked", RestaurantController.getTopBookedRestaurants);
export default router;
