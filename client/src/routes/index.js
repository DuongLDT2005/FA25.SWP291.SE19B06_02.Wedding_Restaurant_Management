import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/homePage";
import SignUpCustomer from "../pages/auth/SignUpCustomerPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpOwner from "../pages/auth/SignUpOwnerPage";
import RestaurantDetails from "../pages/restaurant/RestaurantDetailsPage";
import PartnerDashboard from "../pages/partner/dashboard/Dashboard";
import ProfileBusiness from "../pages/partner/Profile";
import Restaurants from "../pages/partner/restaurant/RestaurantListPage";
import RestaurantCreatePage from "../pages/partner/restaurant/RestaurantCreatePage";
import HallDetailPage from "../pages/partner/restaurant/HallDetailPage";
import RestaurantDetail from "../pages/partner/restaurant/RestaurantDetails";
import HallCreate from "../pages/partner/restaurant/HallCreatePage";
import PartnerBookingPage from "../pages/partner/booking/PartnerBookingPage";
import HallSchedulePage from "../pages/partner/restaurant/HallSchedulePage";
import BookingDetailPage from "../pages/partner/booking/BookingDetailPage";
import ContractPage from "../pages/partner/booking/ContractPage";
import PartnerPaymentPage from "../pages/partner/payment/PartnerPaymentPage";
import PartnerPayoutPage from "../pages/partner/payment/PartnerPayoutPage";
import Notification from "../pages/partner/Notification";
import PartnerReviewPage from "../pages/partner/review/PartnerReviewPage";
import NegotiationPage from "../pages/partner/NegotiationPage";
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
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/partner/negotiation" element={<NegotiationPage />} />
        {/* <Route path="/partner/profile" element={<ProfileBusiness />} /> */}
        <Route path="/partner/restaurants" element={<Restaurants />} />
        <Route path="/partner/restaurants/new" element={<RestaurantCreatePage />} />
        <Route path="/partner/restaurants/detail/:id" element={<RestaurantDetail />} />
        <Route path="/partner/halls/detail/:id" element={<HallDetailPage />} />
        <Route path="/partner/halls/new" element={<HallCreate />} />
        <Route path="/partner/hall-schedule" element={<HallSchedulePage />} />
        <Route path="/partner/bookings" element={<PartnerBookingPage />} />
        <Route path="/partner/profile" element={<ProfileBusiness />} />
        <Route path="/partner/bookings/:id" element={<BookingDetailPage />} />
        <Route path="/partner/bookings/:id/contract" element={<ContractPage />} />
        <Route path="/partner/payments" element={<PartnerPaymentPage />} />
        <Route path="/partner/payouts" element={<PartnerPayoutPage />} />
        <Route path="/partner/reviews" element={<PartnerReviewPage />} />
        <Route path="/partner/notifications" element={<Notification />} />

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