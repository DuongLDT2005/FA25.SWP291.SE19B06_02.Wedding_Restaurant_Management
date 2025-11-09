import React, { useState } from "react";
import { Tabs, Tab, Alert } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import mock from "../../../../mock/partnerMock";
import { useParams } from "react-router-dom";

import RestaurantProfile from "../../../partner/restaurant/RestaurantProfile";
import RestaurantHalls from "../../../partner/restaurant/HallListPage";
import MenuManagement from "../../../partner/restaurant/MenuListPage";
import DishManagement from "../../../partner/restaurant/DishListPage";
import ServiceListPage from "../../../partner/restaurant/ServiceListPage";
import AmenityListPage from "../../../partner/restaurant/AmenityListPage";
import PromotionListPage from "../../../partner/restaurant/PromotionListPage";

export default function AdminRestaurantDetail() {
  const { id } = useParams();
  const restaurantId = parseInt(id, 10);
  const restaurant = mock.restaurants.find(
    (r) => r.restaurantID === restaurantId
  );
  const [activeTab, setActiveTab] = useState("profile");

  if (!restaurant) {
    return (
      <AdminLayout>
        <Alert variant="danger" className="mt-3">
          Không tìm thấy nhà hàng với ID: {id}
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Chi tiết nhà hàng (Admin)">
      <div className="container py-4">
        <h2 className="mb-4">{restaurant.name}</h2>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          id="restaurant-tabs"
          className="mb-3"
        >
          <Tab eventKey="profile" title="Hồ sơ">
            <RestaurantProfile restaurant={restaurant} readOnly={true} />
          </Tab>

          <Tab eventKey="amenities" title="Tiện nghi">
            <AmenityListPage readOnly={true} />
          </Tab>

          <Tab eventKey="halls" title="Sảnh tiệc">
            <RestaurantHalls restaurant={restaurant} readOnly={true} />
          </Tab>

          <Tab eventKey="menu" title="Thực đơn">
            <MenuManagement readOnly={true} />
          </Tab>

          <Tab eventKey="dishes" title="Món ăn">
            <DishManagement readOnly={true} />
          </Tab>

          <Tab eventKey="services" title="Dịch vụ">
            <ServiceListPage readOnly={true} />
          </Tab>

          <Tab eventKey="promotions" title="Ưu đãi">
            <PromotionListPage readOnly={true} />
          </Tab>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
