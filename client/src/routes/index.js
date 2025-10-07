import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/homePage";
import SignUpCustomer from "../pages/auth/SignUpCustomerPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpOwner from "../pages/auth/SignUpOwnerPage";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import RestaurantDetails from "../pages/restaurant/RestaurantDetailsPage";
import ListingRestaurants from "../pages/restaurant/ListingRestaurant";
import PaymentPage from "../pages/payment/PaymentPage";
import BookingDetailsPage from "../pages/booking/BookingDetailsPage";
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


        {/* Booking Routes */}
        <Route path="/booking/:bookingId" element={<BookingDetailsPage />} />
        <Route path="/booking/:bookingId/contract" element={<BookingDetailsPage />} />
        <Route path="/booking/:bookingId/payments" element={<BookingDetailsPage />} />

        {/* Payment Routes */}
        <Route path="/payment/:bookingId" element={<PaymentPage />} />
        <Route path="/payment/new" element={<PaymentPage />} />

        {/* Thêm các route khác tại đây */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
