import {Router} from "express";
import RestaurantController from "../controllers/RestaurantController.js";

const router = Router();

router.get("/", RestaurantController.getAll);
router.get("/:id", RestaurantController.getById);
router.post("/",RestaurantController.createRestaurant);
router.put("/:id",RestaurantController.updateRestaurant);
router.delete("/:id",RestaurantController.deleteRestaurant);

export default router;