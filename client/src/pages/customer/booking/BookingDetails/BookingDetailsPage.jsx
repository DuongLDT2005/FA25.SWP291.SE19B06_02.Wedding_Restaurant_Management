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
import ScrollToTopButton from "../../../../components/ScrollToTopButton";
import "../../../../styles/BookingDetailsStyles.css";
import useBooking from "../../../../hooks/useBooking";
import MainLayout from "../../../../layouts/MainLayout";

const PRIMARY = "#D81C45";

function buildDetailPayload(b) {
  // Build customer info strictly from booking data (not auth)
  const embeddedUser = b.customer || {}
  console.log(b);
  const customer = {
    fullName: b.customer?.user?.fullName || embeddedUser.fullName || embeddedUser.name || "Khách hàng",
    phone: b.customer?.user?.phone || embeddedUser.phone || "N/A",
    email: b.customer?.user?.email || embeddedUser.email || "N/A",
  }
  // Build restaurant from hall.restaurant
  const restaurant = {
    name: b.hall?.restaurant?.name || "Nhà hàng",
    address: b.hall?.restaurant?.fullAddress || "Đang cập nhật",
    thumbnailURL: b.hall?.restaurant?.thumbnailURL || "",
  }

  // Build hall
  const hall = {
    name: b.hall?.name || "Sảnh",
    capacity: b.hall?.maxTable*10 || b.tableCount || 0,
    area: parseFloat(b.hall?.area) || 0,
    price: parseFloat(b.hall?.price) || 0,
  }

  // Build menu with categories from bookingdishes
  const dishMap = {};
  (b.bookingdishes || []).forEach(bd => {
    const dish = bd.dish;
    if (!dishMap[dish.categoryID]) {
      dishMap[dish.categoryID] = {
        name: `Danh mục ${dish.categoryID}`,
        dishes: []
      };
    }
    dishMap[dish.categoryID].dishes.push({
      id: dish.dishID,
      name: dish.name,
      price: 0,
      imageURL: dish.imageURL
    });
  });
  const menu = {
    name: b.menu?.name || "Menu đã chọn",
    price: parseFloat(b.menu?.price) || 0,
    categories: Object.values(dishMap)
  }

  // Build services from bookingservices
  const services = (b.services || []).map(bs => ({
    name: bs.service?.name || "Dịch vụ",
    quantity: bs.quantity || 1,
    price: parseFloat(bs.service?.price) || 0
  }));

  return {
    bookingID: b.bookingID,
    status: b.status ?? 0,
    eventType: b.eventType?.name || "Tiệc cưới",
    eventDate: b.eventDate,
    startTime: b.startTime || "18:00",
    endTime: b.endTime || "22:00",
    tableCount: b.tableCount || 0,
    specialRequest: b.specialRequest || "",
    createdAt: b.createdAt || new Date().toISOString(),
    customer,
    restaurant,
    hall,
    menu,
    services,
    payments: b.payments || [],
    contract: b.contract || {
      content: "Hợp đồng dịch vụ...",
      status: 0,
      signedAt: null,
    },
    originalPrice: parseFloat(b.originalPrice) || 0,
    discountAmount: parseFloat(b.discountAmount) || 0,
    VAT: parseFloat(b.VAT) || 0,
    totalAmount: parseFloat(b.totalAmount) || 0,
  }
}

// ================== COMPONENT ================== //
export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { booking: bookingSlice, hydrateFromDTO, setFinancial } = useBooking();

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
    if (hasLoaded) return;

    // 1️⃣ Ưu tiên lấy từ sessionStorage theo bookingId
    const stored = sessionStorage.getItem(`booking_${bookingId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Chuẩn hóa dữ liệu từ backend
        const normalized = buildDetailPayload(parsed);
        setBooking(normalized);
        // Update Redux
        try {
          hydrateFromDTO(normalized)
          setFinancial({
            originalPrice: normalized.originalPrice,
            discountAmount: normalized.discountAmount,
            VAT: normalized.VAT,
            totalAmount: normalized.totalAmount,
          })
        } catch {}
        setHasLoaded(true);
        setLoading(false);
        return;
      } catch (err) {
        console.warn("Cannot parse stored booking");
      }
    }

    // 2️⃣ Nếu không có → hiển thị lỗi
    setLoading(false);
    setHasLoaded(true);
    alert("Không tìm thấy thông tin đặt tiệc. Vui lòng quay lại trang danh sách.");
    navigate(-1);
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
      <div style={{ maxWidth: "1200px", margin: "0 160px" }} className="container-fluid ">
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
                      onUpdateBooking={(updated) => {
                        setBooking(updated);
                        sessionStorage.setItem("currentBooking", JSON.stringify(updated));
                      }}
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
