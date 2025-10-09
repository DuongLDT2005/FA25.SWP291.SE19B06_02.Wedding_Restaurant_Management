import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/homePage";
import SignUpCustomer from "../pages/auth/SignUpCustomerPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpOwner from "../pages/auth/SignUpOwnerPage";
import RestaurantDetails from "../pages/restaurant/RestaurantDetailsPage";
import DefaultLayout from "../pages/admin/layout/DefaultLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";

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
        </Route>
        {/* Thêm các route khác tại đây */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
