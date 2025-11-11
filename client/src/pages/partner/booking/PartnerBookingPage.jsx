import React, { useState, useMemo } from "react";
import { Tabs, Tab, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PartnerLayout from "../../../layouts/PartnerLayout";
import BookingCard from "./BookingCard";
import mock from "../../../mock/partnerMock";

const TIME_SLOTS = [
  { label: "Buổi trưa (10:30 - 14:00)", startTime: "10:30", endTime: "14:00" },
  { label: "Buổi tối (17:30 - 21:00)", startTime: "17:30", endTime: "21:00" },
];

export default function PartnerBookingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [restaurantFilter, setRestaurantFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState(""); // will store startTime like "10:30"

  // --- Chuẩn bị dữ liệu booking có đầy đủ thông tin ---
  const bookings = useMemo(() => {
    const restaurants = mock?.restaurants || [];
    const customers = mock?.customers || [];
    const menus = mock?.menu || [];
    const promotions = mock?.promotions || [];

    return (mock?.bookings || []).map((b) => {
      const restaurant = restaurants.find((r) =>
        (r.halls || []).some((h) => h.hallID === b.hallID)
      );
      const hall = restaurant?.halls?.find((h) => h.hallID === b.hallID);
      const customer = customers.find((c) => c.customerID === b.customerID);
      const menu = menus.find((m) => m.menuID === b.menuID);
      const promo = restaurant?.promotions?.length
        ? promotions.find((p) => p.promotionID === restaurant.promotions[0])
        : null;

      return {
        ...b,
        hallID: b.hallID,
        hallName: hall?.name ?? "Không xác định",
        restaurantID: restaurant?.restaurantID ?? null,
        restaurantName: restaurant?.name ?? "Không xác định",
        restaurantThumbnail: restaurant?.thumbnailURL ?? "",
        menuName: menu?.name ?? "Không xác định",
        promotionName: promo?.name ?? "Không có ưu đãi",
        promotionDiscount: promo?.discountValue ?? 0,
        fullName: customer?.fullName ?? "Ẩn danh",
        phone: customer?.phone ?? "Không có",
        email: customer?.email ?? "Không có",
        checked: b.checked ?? 0,
        totalAmount: b.totalAmount ?? 0,
      };
    });
  }, []);

  // --- Lọc dữ liệu theo tab và filter ---
  const filteredBookings = useMemo(() => {
    let data = [];

    switch (activeTab) {
      case "pending":
        data = bookings.filter((b) => b.status === 0 && b.checked === 0);
        break;
      case "checked":
        data = bookings.filter((b) => b.status === 0 && b.checked === 1);
        break;
      case "confirmed":
        data = bookings.filter((b) => [1, 3].includes(b.status));
        break;
      case "done":
        data = bookings.filter((b) => [2, 4].includes(b.status));
        break;
      case "rejected":
        data = bookings.filter((b) => b.status === 5);
        break;
      default:
        data = bookings;
    }

    return data.filter(
      (b) =>
        (!restaurantFilter || b.restaurantID === Number(restaurantFilter)) &&
        (!dateFilter || b.eventDate === dateFilter) &&
        (!timeFilter || b.startTime >= timeFilter)
    );
  }, [activeTab, restaurantFilter, dateFilter, timeFilter, bookings]);

  // --- Hành động ---
  const handleMarkChecked = (bookingID) => {
    if (window.confirm("Đánh dấu booking này đã được kiểm tra?")) {
      alert(`Booking ${bookingID} đã được đánh dấu là đã kiểm tra.`);
    }
  };

  const handleReject = (bookingID) => {
    if (window.confirm("Bạn có chắc muốn từ chối booking này?")) {
      alert(`Booking ${bookingID} đã bị từ chối.`);
    }
  };

  const handleView = (bookingID) => {
    navigate(`/partner/bookings/${bookingID}`);
  };

  // current selected label for select (fallback to empty)
  const currentSlotLabel =
    TIME_SLOTS.find((s) => s.startTime === timeFilter)?.label || "";

  return (
    <PartnerLayout>
      <div className="p-3">
        <h3 className="mb-3 fw-bold text-primary">Quản lý đặt tiệc</h3>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          justify
        >
          <Tab eventKey="pending" title="Chờ xử lý" />
          <Tab eventKey="checked" title="Đã kiểm tra" />
          <Tab eventKey="confirmed" title="Đã xác nhận / Đã cọc" />
          <Tab eventKey="done" title="Đã hoàn tất / Hủy" />
          <Tab eventKey="rejected" title="Từ chối" />
        </Tabs>

        {/* Filters */}
        <Row className="mb-3">
          <Col md={5}>
            <Form.Select
              value={restaurantFilter}
              onChange={(e) => setRestaurantFilter(e.target.value)}
            >
              <option value="">-- Chọn nhà hàng --</option>
              {(mock?.restaurants || []).map((r) => (
                <option key={r.restaurantID} value={r.restaurantID}>
                  {r.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Select
                value={currentSlotLabel}
                onChange={(e) => {
                  const label = e.target.value;
                  const slot = TIME_SLOTS.find((s) => s.label === label);
                  setTimeFilter(slot ? slot.startTime : "");
                }}
              >
                <option value="">-- Khung giờ --</option>
                {TIME_SLOTS.map((s) => (
                  <option key={s.label} value={s.label}>
                    {s.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Booking Cards */}
        <Row>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((b) => (
              <Col md={4} key={b.bookingID} className="mb-3">
                <BookingCard
                  booking={b}
                  activeTab={activeTab}
                  onViewDetail={handleView}
                  onMarkChecked={handleMarkChecked}
                  onReject={handleReject}
                />
              </Col>
            ))
          ) : (
            <div className="text-center text-muted py-4">
              Không có booking nào phù hợp
            </div>
          )}
        </Row>
      </div>
    </PartnerLayout>
  );
}