import HallController from "../controllers/HallController.js";
import { Router } from "express";

const router = Router();

router.post("/", HallController.createHall);
router.get("/:id", HallController.getHallById);
router.put("/:id", HallController.updateHall);
router.delete("/:id", HallController.deleteHall);
router.get("/restaurant/:restaurantId", HallController.getHallsByRestaurantId);
router.post("/update/status/:id", HallController.updateHallStatus);


// Hall Images
router.post("/images", HallController.addHallImage);
router.get("/images/:hallId", HallController.getHallImages);
router.delete("/images/:imageId", HallController.deleteHallImage);
export default router;