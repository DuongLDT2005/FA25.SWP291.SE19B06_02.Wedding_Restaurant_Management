// BookingDetailsPage.jsx
import React, { useState, useEffect } from "react";
import {
  useParams,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Tab,
  Spinner,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import OverviewTab from "./components/OverviewTab";
import ContractTab from "./components/ContractTab";
import ReportIssueModal from "./components/ReportIssueModal";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import "../../../styles/BookingDetailsStyles.css";
import useBooking from "../../../hooks/useBooking";
import MainLayout from "../../../layouts/MainLayout";

const PRIMARY = "#D81C45";

// ================= MOCK DATA ================= //
const restaurants = [
  {
    id: 1,
    name: "Quảng Đại Gold",
    address: { fullAddress: "8 30 Tháng 4, Hải Châu, Đà Nẵng" },
    halls: [
      { id: 1, name: "Sảnh Vàng", capacity: 300, area: 500, price: 10000000 },
      { id: 2, name: "Sảnh Bạc", capacity: 500, area: 800, price: 15000000 },
    ],
    menus: [
      {
        id: 1,
        name: "Menu Truyền Thống",
        price: 3500000,
        categories: [
          {
            name: "Khai vị",
            dishes: [
              { id: 1, name: "Gỏi ngó sen tôm thịt" },
              { id: 2, name: "Súp cua gà xé" },
            ],
          },
          {
            name: "Món chính",
            dishes: [
              { id: 3, name: "Gà hấp lá chanh" },
              { id: 4, name: "Bò nướng tiêu đen" },
              { id: 5, name: "Cá hấp xì dầu" },
            ],
          },
          {
            name: "Tráng miệng",
            dishes: [{ id: 6, name: "Chè hạt sen long nhãn" }],
          },
        ],
      },
      {
        id: 2,
        name: "Menu Cao Cấp",
        price: 4500000,
        categories: [
          {
            name: "Khai vị",
            dishes: [
              { id: 1, name: "Gỏi tôm thịt đặc biệt" },
              { id: 2, name: "Nem nướng Huế" },
            ],
          },
          {
            name: "Món chính",
            dishes: [
              { id: 3, name: "Tôm hùm nướng bơ tỏi" },
              { id: 4, name: "Bò Wagyu sốt tiêu đen" },
            ],
          },
          {
            name: "Tráng miệng",
            dishes: [{ id: 5, name: "Bánh flan caramel" }],
          },
        ],
      },
    ],
    services: [
      { id: 1, name: "Trang trí hoa tươi", price: 5000000 },
      { id: 2, name: "Ban nhạc sống", price: 8000000 },
      { id: 3, name: "Máy chiếu & màn hình LED", price: 3000000 },
    ],
  },
];

// ================== MOCK BOOKING ================== //
export const mockBooking = (bookingId) => {
  const restaurant = restaurants[0];
  const hall = restaurant.halls[0];
  const menu = restaurant.menus[0];

  return {
    bookingID: bookingId,
    customer: {
      fullName: "Nguyễn Văn A",
      phone: "0123456789",
      email: "nguyenvana@example.com",
    },
    restaurant: {
      name: restaurant.name,
      address: restaurant.address.fullAddress,
    },
    hall,
    eventType: "Tiệc cưới",
    eventDate: "2025-12-25",
    startTime: "18:00",
    endTime: "22:00",
    tableCount: 20,
    specialRequest: "Trang trí hoa hồng đỏ",
    status: 0,
    acceptedAt: null,
    menu,
    services: [
      { id: 1, name: "Trang trí hoa tươi", quantity: 1, price: 5000000 },
      { id: 2, name: "Ban nhạc sống", quantity: 1, price: 8000000 },
    ],
    originalPrice: 50000000,
    discountAmount: 5000000,
    VAT: 4500000,
    totalAmount: 49500000,
    createdAt: new Date().toISOString(),
    payments: [],
    contract: {
      content: "Hợp đồng dịch vụ tiệc cưới...",
      status: 0,
      signedAt: null,
    },
  };
};

// ================== COMPONENT ================== //
export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { booking: bookingSlice } = useBooking();

  const [activeKey, setActiveKey] = useState("overview");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();

  // --- tab switch ---
  useEffect(() => {
    if (location.pathname.endsWith("/contract")) setActiveKey("contract");
    else if (location.pathname.endsWith("/payments")) setActiveKey("payments");
    else setActiveKey("overview");
  }, [location.pathname]);

  // --- Load data ---
  useEffect(() => {
    if (!hasLoaded) {
      const mockData = mockBooking(bookingId || 1);
      setBooking(mockData);
      setLoading(false);
      setHasLoaded(true);
    }
  }, [bookingId, hasLoaded]);

  // --- Payment state ---
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    setPaymentCompleted(paymentStatus === "1");
  }, [searchParams]);

  const handleApprove = () => {
    if (window.confirm("Xác nhận tiệc này?")) {
      const updated = { ...booking, status: 1, acceptedAt: new Date() };
      setBooking(updated);
      sessionStorage.setItem("currentBooking", JSON.stringify(updated));
      alert("Đã xác nhận!");
    }
  };

  const handleReject = () => {
    if (window.confirm("Bạn chắc chắn muốn hủy?")) {
      const updated = { ...booking, status: 2, rejectedAt: new Date() };
      setBooking(updated);
      sessionStorage.setItem("currentBooking", JSON.stringify(updated));
      alert("Đã hủy đặt tiệc!");
    }
  };

  const getStatusText = (s) =>
  ({
    0: "Chờ xác nhận",
    1: "Đã chấp nhận",
    2: "Đã từ chối",
    3: "Đã xác nhận",
    4: "Đã đặt cọc",
    5: "Hết hạn",
    6: "Đã hủy",
    7: "Hoàn thành",
  }[s] || "Không xác định");

  if (loading || !booking)
    return (
      <Container fluid className="py-5 text-center">
        <Spinner animation="border" style={{ color: PRIMARY }} />
      </Container>
    );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: "1200px", margin: "0 160px" }} className="container-fluid">
        <Container fluid className="py-4">
          <Card
            className="mb-3"
            style={{ borderRadius: 12, overflow: "hidden" }}
          >
            <Card.Body
              style={{
                background: PRIMARY,
                color: "#fff",
              }}
            >
              <Row className="align-items-center">
                <Col md={8}>
                  <h2 className="mb-1">Chi tiết đặt tiệc</h2>
                  <div>
                    {booking.restaurant.name} • {formatDate(booking.eventDate)}
                  </div>
                </Col>
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                  <Badge
                    bg="light"
                    text="dark"
                    style={{
                      color: PRIMARY,
                      border: `2px solid ${PRIMARY}`,
                      padding: "0.65rem 1rem",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {getStatusText(booking.status)}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Tab.Container
            activeKey={activeKey}
            onSelect={(k) => {
              setActiveKey(k);
              navigate(`/booking/${bookingId}/${k === "overview" ? "" : k}`);
            }}
          >
            <Card>
              <Card.Body>
                <Nav variant="tabs" activeKey={activeKey} className="mb-3">
                  <Nav.Item>
                    <Nav.Link
                      eventKey="overview"
                      style={{ color: PRIMARY, fontWeight: 600 }}
                    >
                      Tổng quan
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="contract"
                      style={{ color: PRIMARY, fontWeight: 600 }}
                    >
                      Hợp đồng
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="overview">
                    <OverviewTab
                      booking={booking}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isApproved={booking.status === 1}
                      paymentCompleted={paymentCompleted}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey="contract">
                    <ContractTab booking={booking} />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>

          <ScrollToTopButton />
        </Container>
      </div>
    </MainLayout>

  );
}
