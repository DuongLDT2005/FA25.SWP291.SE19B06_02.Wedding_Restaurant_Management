import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/homePage";
import SignUpCustomer from "../pages/auth/SignUpCustomerPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpOwner from "../pages/auth/SignUpOwnerPage";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import RestaurantDetails from "../pages/restaurant/RestaurantDetailsPage";
import ListingRestaurants from "../pages/restaurant/ListingRestaurant"
import BookingListPage from "../pages/customer/BookingListPage";
import BookingForm from "../pages/customer/BookingForm";
import Profile from "../pages/customer/Profile";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup/customer" element={<SignUpCustomer />} />
        <Route path="/signup/owner" element={<SignUpOwner />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/restaurant/detail" element={<ListingRestaurants />} />
        <Route path="/customer/bookings" element={<BookingListPage />} />
        <Route path="/bookingForm" element={<BookingForm />} />
        <Route path="/customer/profile" element={<Profile />} />
        {/* Thêm các route khác tại đây */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
