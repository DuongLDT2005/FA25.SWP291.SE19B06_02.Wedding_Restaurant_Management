import React, { useState } from "react";
import { Tabs, Tab, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { initialRestaurants } from "../../partner/restaurant/RestaurantListPage";

import RestaurantProfile from "../../partner/restaurant/RestaurantProfile";
import RestaurantHalls from "../../partner/restaurant/HallListPage";
import MenuManagement from "../../partner/restaurant/MenuListPage";
import DishManagement from "../../partner/restaurant/DishListPage";
import ServiceListPage from "../../partner/restaurant/ServiceListPage";
import AmenityListPage from "../../partner/restaurant/AmenityListPage";
import PromotionListPage from "../../partner/restaurant/PromotionListPage";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const restaurantId = parseInt(id, 10);
  const restaurant = initialRestaurants.find((r) => r.id === restaurantId);
  const [activeTab, setActiveTab] = useState("profile");

  if (!restaurant) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
        <Alert variant="danger" className="mt-3">
          Không tìm thấy nhà hàng với ID: {id}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-dark text-light p-4">
      <div className="container-fluid">
        <h2 className="mb-4 text-center">
          🎉 Chi tiết nhà hàng: {restaurant.name}
        </h2>

        <div
          className="rounded p-4 shadow"
          style={{
            backgroundColor: "rgba(32,32,32,0.9)",
            border: "1px solid #3a3a3a",
          }}
        >
          <Tabs
            id="restaurant-tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
            justify
          >
            <Tab eventKey="profile" title="Hồ sơ">
              <ReadonlyWrapper>
                <RestaurantProfile restaurant={restaurant} />
              </ReadonlyWrapper>
            </Tab>
            <Tab eventKey="amenities" title="Tiện nghi">
              <ReadonlyWrapper>
                <AmenityListPage />
              </ReadonlyWrapper>
            </Tab>
            <Tab eventKey="halls" title="Sảnh tiệc">
              <ReadonlyWrapper>
                <RestaurantHalls restaurant={restaurant} />
              </ReadonlyWrapper>
            </Tab>
            <Tab eventKey="menu" title="Thực đơn">
              <ReadonlyWrapper>
                <MenuManagement />
              </ReadonlyWrapper>
            </Tab>
            <Tab eventKey="dishes" title="Món ăn">
              <ReadonlyWrapper dark>
                <DishManagement />
              </ReadonlyWrapper>
            </Tab>
            <Tab eventKey="services" title="Dịch vụ">
              <ReadonlyWrapper dark>
                <ServiceListPage />
              </ReadonlyWrapper>
            </Tab>
            <Tab eventKey="promotions" title="Ưu đãi">
              <ReadonlyWrapper>
                <PromotionListPage />
              </ReadonlyWrapper>
            </Tab>
          </Tabs>
        </div>
      </div>

      <style>{`
        .readonly-wrapper * { color: var(--cui-body-color); }
        .readonly-wrapper input, .readonly-wrapper select, .readonly-wrapper textarea {
          pointer-events: none;
          background-color: #2b2b2b !important;
          color: #ccc !important;
          border: 1px solid #444 !important;
        }
        .readonly-wrapper button, .readonly-wrapper a.btn { display: none !important; }
        .readonly-wrapper table { background-color: transparent !important; color: #ccc !important; }
        .readonly-wrapper th, .readonly-wrapper td {
          background-color: rgba(40,40,40,0.95) !important;
          color: #ddd !important;
          border-color: #444 !important;
        }
        .readonly-wrapper.dark .card,
        .readonly-wrapper.dark .table,
        .readonly-wrapper.dark .form-control {
          background-color: rgba(45,45,45,0.95) !important;
          color: #ddd !important;
          border: 1px solid #444 !important;
        }

        /* ✅ FIX nền trắng từ DishListPage & ServiceListPage */
        .readonly-wrapper.dark .card,
        .readonly-wrapper.dark .card-body,
        .readonly-wrapper.dark .card-header,
        .readonly-wrapper.dark .card-footer,
        .readonly-wrapper.dark .bg-white,
        .readonly-wrapper.dark .bg-light {
          background-color: rgba(35,35,35,0.95) !important;
          color: #ddd !important;
          border-color: #444 !important;
        }

        .nav-tabs .nav-link { background-color: #222 !important; color: #aaa !important; }
        .nav-tabs .nav-link.active {
          background-color: #333 !important;
          color: #fff !important;
          border-bottom: 2px solid #0d6efd !important;
        }
      `}</style>
    </div>
  );
}

function ReadonlyWrapper({ children, dark = false }) {
  return (
    <div
      className={`readonly-wrapper ${dark ? "dark" : ""}`}
      style={{
        backgroundColor: dark ? "rgba(35,35,35,0.95)" : "rgba(45,45,45,0.9)",
        color: "var(--cui-body-color)",
        borderRadius: "0.5rem",
        padding: "1.5rem",
      }}
    >
      {children}
    </div>
  );
}
