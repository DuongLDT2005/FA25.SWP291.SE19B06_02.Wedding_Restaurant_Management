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

/*Admin Routes */
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import UserList from "../pages/admin/management/user/UserList";
import UserDetail from "../pages/admin/management/user/UserDetails";
import AdminRestaurantDetail from "../pages/admin/management/restaurant/AdminRestaurantDetail";
import AdminBookingListPage from "../pages/admin/booking/AdminBookingListPage";
import AdminBookingDetailsPage from "../pages/admin/booking/AdminBookingDetailsPage";
import AdminProfilePage from "../pages/admin/Profile";
import AdminLicensePage from "../pages/admin/management/license/AdminiLicensePage";
import AdminRestaurantList from "../pages/admin/management/restaurant/AdminRestaurantList";
import AdminPaymentListPage from "../pages/admin/management/payment/AdminPaymentListPage";
import AdminPaymentDetail from "../pages/admin/management/payment/AdminPaymentDetail";
import AdminReviewListPage from "../pages/admin/management/report/ReviewList";
import AdminReportListPage from "../pages/admin/management/report/ReportList";
import AdminNotificationPage from "../pages/admin/notification/AdminNotificationPage";
import AdminSettingsPage from "../pages/admin/setting/AdminSettingPage";

import ListingRestaurants from "../pages/restaurant/ListingRestaurant";
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
        <Route
          path="/partner/restaurants/new"
          element={<RestaurantCreatePage />}
        />
        <Route
          path="/partner/restaurants/detail/:id"
          element={<RestaurantDetail />}
        />
        <Route path="/partner/halls/detail/:id" element={<HallDetailPage />} />
        <Route path="/partner/halls/new" element={<HallCreate />} />
        <Route path="/partner/hall-schedule" element={<HallSchedulePage />} />
        <Route path="/partner/bookings" element={<PartnerBookingPage />} />
        <Route path="/partner/profile" element={<ProfileBusiness />} />
        <Route path="/partner/bookings/:id" element={<BookingDetailPage />} />
        <Route
          path="/partner/bookings/:id/contract"
          element={<ContractPage />}
        />
        <Route path="/partner/payments" element={<PartnerPaymentPage />} />
        <Route path="/partner/payouts" element={<PartnerPayoutPage />} />
        <Route path="/partner/reviews" element={<PartnerReviewPage />} />
        <Route path="/partner/notifications" element={<Notification />} />

        <Route path="/restaurant/detail" element={<ListingRestaurants />} />
        <Route path="/customer/bookings" element={<BookingListPage />} />
        <Route path="/bookingForm" element={<BookingForm />} />
        <Route path="/customer/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/users/:id" element = {<UserDetail/>} />
        <Route path="/admin/restaurants" element={<AdminRestaurantList />} />
        <Route path="/admin/restaurants/:id" element = {<AdminRestaurantDetail/>}/>
        <Route path="/admin/bookings" element={<AdminBookingListPage />} />
        <Route path="/admin/bookings/:bookingId" element={<AdminBookingDetailsPage />} />
        <Route path="/admin/license" element={<AdminLicensePage />} />
        <Route path="/admin/profile" element= {<AdminProfilePage/>} />
        <Route path="/admin/payments" element={<AdminPaymentListPage />} />
        <Route path="/admin/payments/:id" element={<AdminPaymentDetail />} />
        <Route path="/admin/reviews" element={<AdminReviewListPage />} />
        <Route path="/admin/reports" element={<AdminReportListPage />} />
        <Route path="/admin/notifications" element={<AdminNotificationPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />

        {/* Booking Routes */}
        <Route path="/booking/:bookingId" element={<BookingDetailsPage />} />
        <Route
          path="/booking/:bookingId/contract"
          element={<BookingDetailsPage />}
        />
        <Route
          path="/booking/:bookingId/payments"
          element={<BookingDetailsPage />}
        />

        {/* Payment Routes */}
        <Route path="/payment/:bookingId" element={<PaymentPage />} />
        <Route path="/payment/new" element={<PaymentPage />} />

        {/* Thêm các route khác tại đây */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
