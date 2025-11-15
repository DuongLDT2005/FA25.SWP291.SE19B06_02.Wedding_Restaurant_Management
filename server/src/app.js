import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hallRoutes from "./routes/hallRoutes.js";
import aiSuggestRoutes from "./routes/aiSuggestRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";
import amenityRoutes from "./routes/AmenityRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminBookingRoutes from "./routes/admin/adminBookingRoutes.js";
import adminPaymentRoutes from "./routes/admin/adminPaymentRoutes.js";
import adminReviewRoutes from "./routes/admin/adminReviewRoutes.js";
import adminReportRoutes from "./routes/admin/adminReportRoutes.js";
import adminUserRoutes from "./routes/admin/adminUserRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, 
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/ai", aiSuggestRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/amenities", amenityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);


app.use("/api/admin/users", adminUserRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);
app.use("/api/admin/reports", adminReportRoutes);

export default app;
