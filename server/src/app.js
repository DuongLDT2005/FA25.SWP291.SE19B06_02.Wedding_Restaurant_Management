import express from "express";
import cors from "cors";

import restaurantRoutes from "./routes/restaurantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hallRoutes from "./routes/hallRoutes.js";
import aiSuggestRoutes from "./routes/aiSuggestRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, 
  })
);

app.use(express.json());

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", userRoutes);
app.use("/api/ai", aiSuggestRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

export default app;
