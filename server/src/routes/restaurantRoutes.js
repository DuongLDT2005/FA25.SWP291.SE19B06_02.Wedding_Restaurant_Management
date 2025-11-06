import RestaurantController from "../controllers/RestaurantController.js";
import { Router } from "express";

const router = Router();

router.get("/", RestaurantController.getAll);    
router.get("/available", RestaurantController.getAvailable);
router.get("/:id", RestaurantController.getOne);
router.get("/partner/:partnerID", RestaurantController.getByPartner);
router.post("/", RestaurantController.create);
router.put("/:id", RestaurantController.update);
router.delete("/:id", RestaurantController.changeRestaurantStatus);

export default router;