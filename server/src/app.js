import express from "express";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hallRoutes from "./routes/hallRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/restaurants",restaurantRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);

export default app;