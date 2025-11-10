// client/src/pages/payment/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import CountdownTimer from "./components/PaymentPage/CountdownTimer";
import PaymentSummary from "./components/PaymentPage/PaymentSummary";
import PaymentMethods from "./components/PaymentPage/PaymentMethods";

// 🧩 Import dữ liệu mock chung
import { mockBooking } from "../booking/BookingDetails/BookingDetailsPage";

const PaymentPage = () => {
  const { bookingId } = useParams();

  // 🌟 State quản lý logic
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [booking, setBooking] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [actualBookingId, setActualBookingId] = useState(bookingId || Date.now().toString());

  // 🧩 1. Load dữ liệu booking
  useEffect(() => {
    if (hasLoaded) return;

    const stored = sessionStorage.getItem("currentBooking");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBooking(parsed);
        setActualBookingId(parsed.bookingID || bookingId);
        setHasLoaded(true);
        return;
      } catch {
        console.warn("PaymentPage: parse booking failed");
      }
    }

    const selectedRestaurant = sessionStorage.getItem("selectedRestaurant");
    const restaurantData = selectedRestaurant ? JSON.parse(selectedRestaurant) : null;
    const newMock = mockBooking(bookingId, restaurantData);
    sessionStorage.setItem("currentBooking", JSON.stringify(newMock));
    setBooking(newMock);
    setActualBookingId(newMock.bookingID);
    setHasLoaded(true);
  }, [hasLoaded, bookingId]);

  // 🧩 2. Đếm ngược thời gian thanh toán
  useEffect(() => {
    if (!hasLoaded || paymentCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("⏰ Hết thời gian thanh toán!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasLoaded, paymentCompleted]);

  // 💰 Helper định dạng tiền
  const formatCurrency = (amount) => (amount || 0).toLocaleString("vi-VN") + " VNĐ";

  // 🪙 Xử lý thanh toán
  const handlePayment = async () => {
    if (!booking) return;
    setIsProcessing(true);

    try {
      await new Promise((r) => setTimeout(r, 2000)); // giả lập thanh toán

      const depositAmount = Math.round((booking.totalAmount || 0) * 0.3);
      const updated = {
        ...booking,
        status: 4,
        payments: [
          ...(booking.payments || []),
          {
            type: 0,
            amount: depositAmount,
            status: 1,
            paymentMethod,
            paymentDate: new Date().toISOString(),
          },
        ],
      };

      sessionStorage.setItem("newBookingData", JSON.stringify(updated));
      sessionStorage.setItem("currentBooking", JSON.stringify(updated));
      setBooking(updated);
      setPaymentCompleted(true);
    } catch (err) {
      alert("❌ Có lỗi xảy ra khi thanh toán.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 🌀 Loading UI
  if (!hasLoaded || !booking) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 mb-0">Đang tải thông tin thanh toán...</p>
      </Container>
    );
  }

  // ✅ Sau khi thanh toán thành công
  if (paymentCompleted) {
    return (
      <Container className="mt-5 text-center">
        <Card className="shadow-sm">
          <Card.Body>
            <div style={{ fontSize: 56, color: "#28a745" }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 className="text-success">Thanh toán thành công!</h2>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>

            <div className="d-grid gap-2 mt-4">
              <Button as={Link} to={`/booking/${actualBookingId}/contract`} variant="primary">
                <i className="fas fa-file-contract me-2"></i> Xem hợp đồng
              </Button>
              <Button as={Link} to={`/booking/${actualBookingId}/payments`} variant="success">
                <i className="fas fa-history me-2"></i> Lịch sử thanh toán
              </Button>
              <Button as={Link} to={`/booking/${actualBookingId}`} variant="outline-primary">
                <i className="fas fa-arrow-left me-2"></i> Quay lại đặt tiệc
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // 💳 Giao diện thanh toán chính (chỉ còn gọi component con)
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Header */}
          <Card className="mb-4 shadow-sm text-center">
            <Card.Body>
              <h2>
                <i className="fas fa-credit-card me-2"></i> Thanh toán đặt tiệc
              </h2>
              <div className="text-muted">
                {booking.restaurant?.name} • {booking.eventDate}
              </div>
            </Card.Body>
          </Card>

          {/* Countdown timer */}
          <CountdownTimer timeLeft={timeLeft} />

          {/* Nội dung chính */}
          <Row>
            <Col md={6} className="mb-3">
              <PaymentSummary booking={booking} />
            </Col>
            <Col md={6}>
              <PaymentMethods
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                handlePayment={handlePayment}
                isProcessing={isProcessing}
                timeLeft={timeLeft}
                depositAmount={Math.round((booking.totalAmount || 0) * 0.3)}
                actualBookingId={actualBookingId}
                formatCurrency={formatCurrency}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
