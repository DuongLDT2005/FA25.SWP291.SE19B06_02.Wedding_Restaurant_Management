import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import BookingForm from "./BookingForm";
import PriceSummaryPanel from "./PriceSummaryPanel";
import SubmitBookingButton from "./SubmitBookingButton";
import useBooking from "../../../hooks/useBooking";
import MainLayout from "../../../layouts/MainLayout";
import { useRestaurant as useRestaurantData } from "../../../hooks/useRestaurantData";
import { restaurantDetail as mockRestaurant } from "../../restaurant/restaurantDetails/RestaurantDetailsPage";
import { Col, Row } from "react-bootstrap";

const BookingPage = () => {
  const location = useLocation();
  const restaurantId = location?.state?.restaurantId;
  const selectedHallId = location?.state?.hallId;
  const { setBookingField } = useBooking();

  // Fetch restaurant from backend if id exists; keep mock as fallback
  const { data: fetchedRestaurant } = useRestaurantData(restaurantId, { enabled: !!restaurantId });
  const restaurant = fetchedRestaurant || mockRestaurant;

  // Prepare menus mapped for MenuSelectorModal: { id, name, price, categories: [{ name, limit, dishes: [string] }] }
  const menus = useMemo(() => {
    const src = Array.isArray(restaurant?.menus) ? restaurant.menus : [];
    return src.map((m) => ({
      id: m.id ?? m.menuID ?? m.name,
      name: m.name,
      price: m.price ?? m.basePrice ?? 0,
      description: m.description || "",
      categories: (m.categories || []).map((c) => ({
        name: c.name,
        limit: c.requiredQuantity ?? c.limit ?? 0,
        dishes: (c.dishes || []).map((d) => (typeof d === "string" ? d : d?.name)).filter(Boolean),
      })),
    }));
  }, [restaurant]);

  // Prepare services for ServiceSelector
  const services = useMemo(() => {
    const svc = Array.isArray(restaurant?.services) ? restaurant.services : [];
    return svc.map((s) => ({ id: s.id ?? s.serviceID ?? s.name, name: s.name, price: s.price ?? s.basePrice ?? 0 }));
  }, [restaurant]);

  // Prefill booking info from effective restaurant
  useEffect(() => {
    if (!restaurant) return;
    try {
      setBookingField("restaurant", restaurant.name || "");
      const halls = Array.isArray(restaurant.halls) ? restaurant.halls : [];
      const chosen = halls.find((h) => h.id === selectedHallId || h.hallID === selectedHallId) || halls[0];
      setBookingField("hall", chosen?.name || "");
      // Store hallID as well for later submit payload
      if (chosen) setBookingField("hallID", chosen.hallID ?? chosen.id);
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant, selectedHallId]);

  return (
    <MainLayout>
      <main className="container mx-auto px-4 py-12 space-y-12">
        <Row>
          <Col xs={12} md={6} lg={7} >
            <BookingForm menus={menus} services={services} />
          </Col>
          <Col xs={12} md={6} lg={5} >
            <PriceSummaryPanel />
          </Col>
        </Row>
      </main>
    </MainLayout >
  );
};

export default BookingPage;