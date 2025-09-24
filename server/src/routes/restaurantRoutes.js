import {Router} from "express";
import RestaurantController from "../controllers/RestaurantController.js";

const router = Router();

router.get("/owner/:ownerID",RestaurantController.getByOwner);
router.get("/", RestaurantController.getAll);
router.get("/:id", RestaurantController.getOne);
router.post("/",RestaurantController.create);
router.put("/:id",RestaurantController.updateRestaurant);
router.delete("/:id",RestaurantController.remove);

export default router;