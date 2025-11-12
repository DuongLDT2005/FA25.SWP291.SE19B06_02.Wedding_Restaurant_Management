import React, { useState } from "react";
import { Tabs, Tab, Alert } from "react-bootstrap";
import AppLayout from "../../../layouts/PartnerLayout";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getRestaurantById } from "../../../services/restaurantService";

// Import từng tab component
import RestaurantProfile from "./RestaurantProfile";
import RestaurantHalls from "./HallListPage";
import MenuManagement from "./MenuListPage";
import DishManagement from "./DishListPage";
import ServiceListPage from "./ServiceListPage";
import AmenityListPage from "./AmenityListPage";
import PromotionListPage from "./PromotionListPage";
export default function RestaurantDetail() {
  const { id } = useParams();
  const restaurantId = parseInt(id, 10);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    async function load() {
      setLoading(true); setError("");
      try {
        const data = await getRestaurantById(restaurantId);
        if (!ignore) setRestaurant(data);
      } catch (e) {
        if (!ignore) setError(e.message || "Không thể tải nhà hàng");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id, restaurantId]);

  const [activeTab, setActiveTab] = useState("profile"); // <-- quản lý active tab

  if (loading) {
    return (
      <AppLayout>
        <div className="mt-3 text-center text-muted">Đang tải...</div>
      </AppLayout>
    );
  }
  if (error) {
    return (
      <AppLayout>
        <Alert variant="danger" className="mt-3">{error}</Alert>
      </AppLayout>
    );
  }
  if (!restaurant) {
    return (
      <AppLayout>
        <Alert variant="danger" className="mt-3">
          Không tìm thấy nhà hàng với ID: {id}
        </Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h2 className="mb-4">Chi tiết nhà hàng</h2>
      <Tabs
        activeKey={activeTab}   // <-- dùng state
        onSelect={(k) => setActiveTab(k)} // cập nhật state khi chuyển tab
        id="restaurant-tabs"
        className="mb-3"
      >
        <Tab eventKey="profile" title="Hồ sơ">
          <RestaurantProfile restaurant={restaurant}
            allEventTypes={[
              { eventTypeID: 1, name: "Tiệc cưới" },
              { eventTypeID: 2, name: "Sinh nhật" },
              { eventTypeID: 3, name: "Hội nghị" },
              { eventTypeID: 4, name: "Tiệc báo hỷ" },
              { eventTypeID: 5, name: "Tiệc liên hoan" },
            ]} />
        </Tab>
        <Tab eventKey="amenities" title="Tiện nghi">
          <AmenityListPage />
        </Tab>
        <Tab eventKey="halls" title="Sảnh tiệc">
          <RestaurantHalls
            restaurant={restaurant}
            setActiveTab={setActiveTab} // <-- truyền setter xuống HallList
          />
        </Tab>
        <Tab eventKey="menu" title="Thực đơn">
          <MenuManagement />
        </Tab>
        <Tab eventKey="dishes" title="Món ăn">
          <DishManagement />
        </Tab>
        <Tab eventKey="services" title="Dịch vụ">
          <ServiceListPage />
        </Tab>
        <Tab eventKey="promotions" title="Ưu đãi">
          <PromotionListPage />
        </Tab>
      </Tabs>
    </AppLayout>
  );
}