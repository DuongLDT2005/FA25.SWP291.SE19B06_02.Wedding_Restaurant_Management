import express from "express";
import AmenityController from "../controllers/AmenityController.js";

const router = express.Router();

// Lấy tất cả tiện nghi
router.get("/", AmenityController.getAll);

// Lấy 1 tiện nghi cụ thể theo ID
router.get("/:id", AmenityController.getByID);

// Lấy danh sách tiện nghi của 1 nhà hàng
router.get("/restaurant/:restaurantID", AmenityController.getByRestaurant);

export default router;
