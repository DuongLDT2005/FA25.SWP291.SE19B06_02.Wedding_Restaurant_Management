import express from "express";
import restaurantRoutes from "./routes/restaurantRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/restaurants",restaurantRoutes);

export default app;