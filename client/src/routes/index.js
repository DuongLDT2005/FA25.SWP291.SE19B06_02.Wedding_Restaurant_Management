import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/homePage";
import SignUpCustomer from "../pages/auth/SignUpCustomerPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpOwner from "../pages/auth/SignUpOwnerPage";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import RestaurantDetails from "../pages/restaurant/RestaurantDetailsPage";
import PartnerDashboard from "../pages/partner/Dashboard";
// import Commission from "../pages/partner/Commission";
// import ProfileBusiness from "../pages/partner/ProfileBusiness";
import Restaurants from "../pages/partner/RestaurantListPage";
import Bookings from "../pages/partner/BookingsPage";
import RestaurantDetail from "../pages/partner/RestaurantDetails";
import NegotiationPage from "../pages/partner/NegotiationPage";
// import BookingDetail from "../pages/partner/BookingDetail";
// import Payments from "../pages/partner/Payments";
// import Reviews from "../pages/partner/Reviews";
// import Notifications from "../pages/partner/Notifications";
import RestaurantResult from "../pages/restaurant/RestaurantResult";

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
        <Route path="/partner" element={<PartnerDashboard />} />
        {/* <Route path="/partner/commission" element={<Commission />} />
        <Route path="/partner/profile" element={<ProfileBusiness />} /> */}
        <Route path="/partner/negotiation" element={<NegotiationPage />} />
        <Route path="/partner/restaurants" element={<Restaurants />} />
        <Route path="/partner/bookings" element={<Bookings />} />
        <Route path="/partner/restaurants/:id" element={<RestaurantDetail />} />
        {/* <Route path="/partner/bookings/:id" element={<BookingDetail />} />
        <Route path="/partner/payments" element={<Payments />} />
        <Route path="/partner/reviews" element={<Reviews />} />
        <Route path="/partner/notifications" element={<Notifications />} /> */}
        {/* Thêm các route khác tại đây */}
        <Route path="/restaurant/result" element={<RestaurantResult />} />
        <Route path="/restaurant/result" element={<RestaurantResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
