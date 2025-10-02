import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Home from "../pages/homePage";
import SignUpCustomer from "../pages/auth/SignUpCustomerPage";
import SignUpOwner from "../pages/auth/SignUpOwnerPage";
import LoginPage from "../pages/auth/LoginPage";

// Admin
import Dashboard from "../pages/admin/dashboard/Dashboard";

// Restaurant
import RestaurantDetails from "../pages/restaurant/RestaurantDetailsPage";

// Partner Layout + Pages
import PartnerLayout from "../layouts/PartnerLayout";
import PartnerDashboard from "../pages/partner/Dashboard";
import Profile from "../pages/partner/Profile";
import ReviewManagement from "../pages/partner/ReviewManagement";
import Notification from "../pages/partner/Notification";

// Partner Restaurant Management
import DishManagement from "../pages/partner/Restaurant/DishManagement";
import MenuManagement from "../pages/partner/Restaurant/MenuManagement";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup/customer" element={<SignUpCustomer />} />
        <Route path="/signup/owner" element={<SignUpOwner />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<Dashboard />} />

        {/* Restaurant routes */}
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />

        {/* Partner routes with layout */}
        <Route path="/partner" element={<PartnerLayout />}>
          <Route index element={<PartnerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="notification" element={<Notification />} />

          {/* Restaurant Management */}
          <Route path="dish" element={<DishManagement />} />
          <Route path="menu" element={<MenuManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
