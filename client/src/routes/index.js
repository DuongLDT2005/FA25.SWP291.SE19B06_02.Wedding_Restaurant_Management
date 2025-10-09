import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/homePage";
import SignUpCustomer from "../pages/auth/SignUpCustomerPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpOwner from "../pages/auth/SignUpOwnerPage";
import RestaurantDetails from "../pages/restaurant/RestaurantDetailsPage";
import DefaultLayout from "../pages/admin/layout/DefaultLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import NotificationsPage from "../pages/admin/notifications/NotificationsPage"


import ListingRestaurants from "../pages/restaurant/ListingRestaurant"
import BookingListPage from "../pages/customer/BookingListPage";
import BookingForm from "../pages/customer/BookingForm";
import Profile from "../pages/customer/Profile";
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
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />

        <Route path="/admin/*" element={<DefaultLayout />}>
          <Route index element={<Dashboard />} /> {/* /admin -> Dashboard */}
          <Route path="dashboard" element={<Dashboard />} /> {/* /admin/dashboard */}
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="/restaurant/detail" element={<ListingRestaurants />} />
        <Route path="/customer/bookings" element={<BookingListPage />} />
        <Route path="/bookingForm" element={<BookingForm />} />
        <Route path="/customer/profile" element={<Profile />} />

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
