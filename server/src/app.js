import express from "express";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hallRoutes from "./routes/hallRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/restaurants",restaurantRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",userRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;