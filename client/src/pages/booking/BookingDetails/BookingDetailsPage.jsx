// BookingDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Nav, Tab, Spinner, Badge} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import OverviewTab from "./components/OverviewTab";
import ContractTab from "./components/ContractTab";
import ReportIssueModal from "./components/ReportIssueModal";
import ScrollToTopButton from "../../../components/ScrollToTopButton";
import "../../../styles/BookingDetailsStyles.css"; // optional extra styles
import useBooking from "../../../hooks/useBooking";


const PRIMARY = "#D81C45";

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
export const mockBooking = (bookingId, restaurantData = null) => ({
    bookingID: bookingId,
    customer: { fullName: "Nguyễn Văn A", phone: "0123456789", email: "customer@email.com" },
    restaurant: { 
      name: restaurantData?.restaurantName || "Quảng Đại Gold", 
      address: restaurantData?.restaurantAddress || "8 30 Tháng 4, Hải Châu, Đà Nẵng" 
    },
    hall: restaurantData?.selectedHall 
      ? { 
          name: restaurantData.selectedHall.hallName, 
          capacity: restaurantData.selectedHall.capacity, 
          area: restaurantData.selectedHall.area 
        } 
      : { name: "Sảnh Hoa Hồng", capacity: 500, area: 600 },
    eventType: "Tiệc cưới",
    eventDate: "2024-12-25",
    startTime: "18:00",
    endTime: "22:00",
    tableCount: 20,
    specialRequest: "Trang trí hoa hồng đỏ",
    status: 0,
    acceptedAt: null, 
    originalPrice: 50000000,
    discountAmount: 5000000,
    VAT: 4500000,
    totalAmount: 49500000,
    createdAt: new Date().toISOString(),
    menu: { 
      name: "Menu Truyền Thống", 
      price: 2500000, 
      categories: [
        { 
          name: "Món khai vị", 
          dishes: [
            { id: 1, name: "Gỏi ngó sen tôm thịt", price: 450000 },
            { id: 2, name: "Súp cua gà xé", price: 400000 }
          ] 
        }, 
        { 
          name: "Món chính", 
          dishes: [
            { id: 3, name: "Gà hấp lá chanh", price: 650000 },
            { id: 4, name: "Bò nướng tiêu đen", price: 750000 },
            { id: 5, name: "Cá hấp xì dầu", price: 700000 }
          ] 
        }, 
        { 
          name: "Tráng miệng", 
          dishes: [
            { id: 6, name: "Chè hạt sen long nhãn", price: 250000 }
          ] 
        }
      ] 
    },
    services: [
      { name: "Trang trí hoa tươi", quantity: 1, price: 5000000 },
      { name: "Ban nhạc sống", quantity: 1, price: 8000000 }
    ],
    payments: [],
    contract: { content: "Hợp đồng dịch vụ tiệc cưới...", status: 0, signedAt: null }
  });
  
export default function BookingDetailsPage() {
    const { bookingId } = useParams();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { booking: bookingSlice } = useBooking();

    const [activeKey, setActiveKey] = useState("overview");
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
                if (location.pathname.endsWith("/contract")) {
                setActiveKey("contract");
               } else if (location.pathname.endsWith("/payments")) {
                  setActiveKey("payments");
                } else {
                    setActiveKey("overview");
                }
            }, [location.pathname]);

    useEffect(() => {
        if (!hasLoaded) {
            // 1) Prefer Redux slice hydrated via hydrateFromDTO
            const sliceId = bookingSlice?.bookingID
              || bookingSlice?.bookingId
              || bookingSlice?.id
              || bookingSlice?.bookingInfo?.bookingID
              || bookingSlice?.bookingInfo?.bookingId
              || bookingSlice?.bookingInfo?.id;
            if (sliceId && String(sliceId) === String(bookingId)) {
                const merged = {
                    bookingID: sliceId,
                    ...bookingSlice,
                };
                setBooking(merged);
                try { sessionStorage.setItem(`booking_${sliceId}`, JSON.stringify(merged)); } catch {}
                setLoading(false);
                setHasLoaded(true);
                return;
            }

            // 2) Fallback to sessionStorage key set by BookingListPage
            const key = `booking_${bookingId}`;
            const storedByKey = sessionStorage.getItem(key);
            if (storedByKey) {
                try {
                    const parsed = JSON.parse(storedByKey);
                    setBooking(parsed);
                    setLoading(false);
                    setHasLoaded(true);
                    return;
                } catch (e) {
                    console.error("Error parsing booking from sessionStorage:", e);
                }
            }

            // 3) Legacy fallback: previous storage/state
            const legacy = sessionStorage.getItem("currentBooking");
            if (legacy) {
                try {
                    const parsedLegacy = JSON.parse(legacy);
                    if (parsedLegacy.bookingID === bookingId) {
                        setBooking(parsedLegacy);
                        setLoading(false);
                        setHasLoaded(true);
                        return;
                    }
                } catch (e) {
                    console.error("Error parsing legacy booking:", e);
                }
            }

            if (location.state?.booking) {
                const b = location.state.booking;
                setBooking(b);
                try { sessionStorage.setItem(`booking_${b.bookingID || b.id || bookingId}` , JSON.stringify(b)); } catch {}
                setLoading(false);
                setHasLoaded(true);
                return;
            }

            // 4) As a last resort, build from mock/temp form
            fetchBookingDetails();
            setHasLoaded(true);
        }

        const paymentStatus = searchParams.get("payment");
        if (paymentStatus === "1") {
            setPaymentCompleted(true);
        } else {
            // Nếu không có payment parameter hoặc là "0", dựa vào booking.payments để xác định
            if (booking && booking.payments && booking.payments.length > 0) {
                const hasConfirmedPayment = booking.payments.some(p => p.status === 1);
                setPaymentCompleted(hasConfirmedPayment);
            } else {
                setPaymentCompleted(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingId, hasLoaded, searchParams, booking]);

        const fetchBookingDetails = () => {
        try {
          setLoading(true);
          const bookingDataFromForm = sessionStorage.getItem("newBookingData");
          if (bookingDataFromForm) {
            setBooking(JSON.parse(bookingDataFromForm));
            setLoading(false);
            setHasLoaded(true);
            return;
          }
      
          const selectedRestaurant = sessionStorage.getItem("selectedRestaurant");
          const restaurantData = selectedRestaurant ? JSON.parse(selectedRestaurant) : null;
      
          const mockData = mockBooking(bookingId, restaurantData);
      
          setBooking(mockData);
          setLoading(false);
          setHasLoaded(true);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      };
      

    const getStatusText = (s) => {
        return { 
            0: "Chờ xác nhận",      // PENDING
            1: "Đã chấp nhận",      // ACCEPTED
            2: "Đã từ chối",        // REJECTED
            3: "Đã xác nhận",       // CONFIRMED
            4: "Đã đặt cọc",        // DEPOSITED
            5: "Hết hạn",           // EXPIRED
            6: "Đã hủy",            // CANCELLED
            7: "Hoàn thành"         // COMPLETED
        }[s] || "Không xác định";
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleApprove = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xác nhận thông tin đặt tiệc này?")) {
            try {
                const updatedBooking = {
                    ...booking,
                    status: 1, // ACCEPTED
                    acceptedAt: new Date().toISOString() // Lưu thời gian khi chuyển sang ACCEPTED
                };
                setBooking(updatedBooking);
                sessionStorage.setItem("currentBooking", JSON.stringify(updatedBooking));
                alert("Đã xác nhận thành công! Xin vui lòng đợi để bên partner có thể xét duyệt.");
            } catch (error) {
                console.error("Error confirming booking:", error);
                alert("Có lỗi xảy ra khi xác nhận. Vui lòng thử lại.");
            }
        }
    };

    const handleReject = () => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đặt tiệc này?")) {
            try {
                // Cập nhật status = 2 (REJECTED)
                const updatedBooking = {
                    ...booking,
                    status: 2, // REJECTED
                    rejectedAt: new Date().toISOString()
                };
                setBooking(updatedBooking);
                sessionStorage.setItem("currentBooking", JSON.stringify(updatedBooking));
                
                alert("Đã hủy đặt tiệc thành công!");
            } catch (error) {
                console.error("Error rejecting booking:", error);
                alert("Có lỗi xảy ra khi hủy đặt tiệc. Vui lòng thử lại.");
            }
        }
    };

    // Thêm useEffect để kiểm tra và tự động chuyển sang EXPIRED nếu quá 7 ngày
    useEffect(() => {
        if (booking && booking.status === 1 && booking.acceptedAt) {
            const acceptedDate = new Date(booking.acceptedAt);
            const now = new Date();
            const daysDiff = Math.floor((now - acceptedDate) / (1000 * 60 * 60 * 24));
            
            // Nếu quá 7 ngày, tự động chuyển sang EXPIRED
            if (daysDiff > 7) {
                const updatedBooking = {
                    ...booking,
                    status: 5, // EXPIRED
                    expiredAt: now.toISOString()
                };
                setBooking(updatedBooking);
                sessionStorage.setItem("currentBooking", JSON.stringify(updatedBooking));
            }
        }
    }, [booking]);

    if (loading) {
        return (
            <Container fluid className="py-5 text-center">
                <Spinner animation="border" style={{ color: PRIMARY }} />
            </Container>
        );
    }

    if (!booking) {
        return (
            <Container fluid className="py-5">
                <Card className="p-4">
                    <h5>Không tìm thấy thông tin đặt tiệc</h5>
                    <p>Vui lòng quay lại trang chủ để đặt tiệc.</p>
                </Card>
            </Container>
        );
    }

    // ensure safe defaults; prefer data embedded in booking (and nested booking.customer.user) not auth context
    booking.customer = booking.customer || {};
    const embeddedUser = booking.customer.user || {};
    booking.customer.fullName = booking.customer.fullName || embeddedUser.fullName || embeddedUser.name || "Khách hàng";
    booking.customer.phone = booking.customer.phone || embeddedUser.phone || "N/A";
    booking.customer.email = booking.customer.email || embeddedUser.email || "N/A";
    booking.restaurant = booking.restaurant || { name: "Nhà hàng", address: "Đang cập nhật" };
    booking.hall = booking.hall || { name: "Sảnh", capacity: 0, area: 0 };
    booking.menu = booking.menu || { name: "Menu", price: 0, categories: [] };
    booking.payments = Array.isArray(booking.payments) ? booking.payments : [];

    return (
        <Container fluid className="py-4">
            <Card className="mb-3" style={{ borderRadius: 12, overflow: "hidden" }}>
                <Card.Body style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY})`, color: "#fff" }}>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h2 className="mb-1">Chi tiết đặt tiệc</h2>
                            <div>{booking.restaurant.name} • {formatDate(booking.eventDate)}</div>
                        </Col>
                        <Col md={4} className="text-md-end mt-3 mt-md-0">
                            <Badge bg="light" text="dark" style={{ color: PRIMARY, border: `2px solid ${PRIMARY}`, padding: "0.65rem 1rem", fontSize: 14, fontWeight: 700 }}>{getStatusText(booking.status)}</Badge>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Tab.Container
                activeKey={activeKey}
                onSelect={(k) => {                    
                    setActiveKey(k);
                    if (k === "contract") {
                        navigate(`/booking/${bookingId}/contract`, { replace: true });
                    } else if (k === "payments") {
                        navigate(`/booking/${bookingId}/payments`, { replace: true });
                    } else {
                        navigate(`/booking/${bookingId}`, { replace: true });
                    }
                }}
            >
                <Row>
                    <Col lg={12}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Nav variant="tabs" activeKey={activeKey} className="mb-3">
                                    <Nav.Item>
                                        <Nav.Link eventKey="overview" style={{ color: PRIMARY, fontWeight: 600 }}>Tổng quan</Nav.Link>
                                    </Nav.Item>
                                    {(booking.status >= 1 || isApproved || paymentCompleted) && (
                                        <>
                                            <Nav.Item>
                                                <Nav.Link eventKey="contract" style={{ color: PRIMARY, fontWeight: 600 }}>Hợp đồng</Nav.Link>
                                            </Nav.Item>
                                            {booking.status >= 3 && (
                                                <Nav.Item>
                                                    <Nav.Link eventKey="payments" style={{ color: PRIMARY, fontWeight: 600 }}>Lịch sử thanh toán</Nav.Link>
                                                </Nav.Item>
                                            )}
                                        </>
                                    )}
                                </Nav>

                                <Tab.Content>
                                    <Tab.Pane eventKey="overview">
                                        <OverviewTab
                                            booking={booking}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
                                            isApproved={booking.status === 1 || booking.status === 3}  // Chỉ ACCEPTED hoặc CONFIRMED
                                            paymentCompleted={booking.status >= 4}
                                            bookingStatus={booking.status}
                                            onBookingUpdate={setBooking}
                                        />
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="contract">
                                        <ContractTab booking={booking} />
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="payments">
                                        <Card>
                                            <Card.Body>
                                                {booking.payments.length === 0 ? (
                                                    <div className="text-center text-muted py-4">Chưa có lịch sử thanh toán</div>
                                                ) : (
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Loại</th><th>Số tiền</th><th>Trạng thái</th><th>Ngày</th><th>Phương thức</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {booking.payments.map((p, i) => (
                                                                    <tr key={i}>
                                                                        <td>{p.type === 0 ? "Tiền cọc (30%)" : "Thanh toán còn lại (70%)"}</td>
                                                                        <td>{p.amount?.toLocaleString() || "-"} VNĐ</td>
                                                                        <td>{p.status === 1 ? "Đã thanh toán" : "Chờ"}</td>
                                                                        <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "-"}</td>
                                                                        <td>{p.paymentMethod || "-"}</td>
                                                                    </tr>   
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Col>


                </Row>
            </Tab.Container>

            {showReportModal && <ReportIssueModal booking={booking} onClose={() => setShowReportModal(false)} />}

            <ScrollToTopButton />
        </Container>
    );
}
