import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import restaurantRoutes from "./routes/restaurantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hallRoutes from "./routes/hallRoutes.js";
import aiSuggestRoutes from "./routes/aiSuggestRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import eventTypeRoutes from "./routes/eventTypeRoutes.js";
import bankAccountRoutes from "./routes/restaurants/bankAccountRoutes.js";
import menuRoutes from "./routes/restaurants/menuRoutes.js";
import dishRoutes from "./routes/restaurants/dishRoutes.js";
import dishCategoryRoutes from "./routes/restaurants/dishCategoryRoutes.js";
import promotionRoutes from "./routes/restaurants/promotionRoutes.js";
import serviceRoutes from "./routes/restaurants/serviceRoutes.js";
import reviewRoutes from "./routes/restaurants/reviewRoutes.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, 
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", userRoutes);
app.use("/api/ai", aiSuggestRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/eventtypes", eventTypeRoutes);
// Nested restaurant-scoped mounts (non-breaking: keep top-level mounts)
// app.use("/api/restaurants/:restaurantId/amenities", amenityRoutes);
// app.use("/api/restaurants/:restaurantId/eventtypes", eventTypeRoutes);
app.use("/api/bankaccounts", bankAccountRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/dishcategories", dishCategoryRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/restaurants/:restaurantId/reviews", reviewRoutes);

export default app;
