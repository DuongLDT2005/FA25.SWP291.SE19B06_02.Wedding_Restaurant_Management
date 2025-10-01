import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SignUp from "../pages/auth/signUpCus";
import LoginPage from "../pages/auth/LoginPage";
import RestaurantResult from "../pages/restaurant/RestaurantResult";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Thêm các route khác tại đây */}
        <Route path="/restaurant/result" element={<RestaurantResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
