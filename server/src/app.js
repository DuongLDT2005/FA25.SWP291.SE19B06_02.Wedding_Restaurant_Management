import express from "express";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();

app.use(express.json());

app.use("/api/restaurants",restaurantRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",userRoutes);
export default app;