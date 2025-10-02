import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import AppLayout from "../../layouts/PartnerLayout";

// Import từng tab component
import RestaurantProfile from "./RestaurantProfile";
import RestaurantHalls from "./RestaurantHalls";
// import RestaurantMenu from "./RestaurantMenu";
// import RestaurantDishes from "./RestaurantDishes";
import RestaurantServicePackages from "./RestaurantServicePackages";
import RestaurantServices from "./RestaurantServices";
// import RestaurantPayment from "./RestaurantPayment";
// import RestaurantReviews from "./RestaurantReviews";
// import RestaurantAmenities from "./RestaurantAmenities";

export default function RestaurantDetail() {
  return (
    <AppLayout>
      <h2 className="mb-4">Chi tiết nhà hàng</h2>
      <Tabs defaultActiveKey="profile" id="restaurant-tabs" className="mb-3">
        <Tab eventKey="profile" title="Hồ sơ">
          <RestaurantProfile />
        </Tab>
        <Tab eventKey="halls" title="Sảnh tiệc">
          <RestaurantHalls />
        </Tab>
        {/* <Tab eventKey="menu" title="Thực đơn">
          <RestaurantMenu />
        </Tab>
        <Tab eventKey="dishes" title="Món ăn">
          <RestaurantDishes />
        </Tab> */}
        <Tab eventKey="packages" title="Gói dịch vụ">
          <RestaurantServicePackages />
        </Tab>
        <Tab eventKey="services" title="Dịch vụ">
          <RestaurantServices />
        </Tab>
        {/* <Tab eventKey="payment" title="Thanh toán">
          <RestaurantPayment />
        </Tab>
        <Tab eventKey="reviews" title="Đánh giá">
          <RestaurantReviews />
        </Tab>
        <Tab eventKey="amenities" title="Tiện ích">
          <RestaurantAmenities />
        </Tab> */}
      </Tabs>
    </AppLayout>
  );
}