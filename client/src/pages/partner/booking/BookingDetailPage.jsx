// File: BookingDetailPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Table, Badge } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import PartnerLayout from "../../../layouts/PartnerLayout";

// Mock booking (thay bằng fetch nếu có API)
const mockBookingDetail = {
  bookingID: 101,
  status: 3, // 0: pending, 1: confirmed, 2: cancelled, 3: deposit, 4: completed, 5: rejected
  checked: 0,
  customer: { name: "Nguyễn Văn B", phone: "0905123456", email: "a.nguyen@example.com" },
  restaurant: {
    name: "The Rose Hall",
    hall: { name: "Sảnh Hồng", price: 15000000 },
    menu: { name: "Menu Tiệc Cưới Cao Cấp", price: 3000000 },
  },
  eventDate: "2025-11-15",
  startTime: "18:00",
  endTime: "22:00",
  tableCount: 30,
  specialRequest: "Trang trí thêm hoa hồng đỏ tại bàn cô dâu chú rể",
  dishCategories: [
    { name: "Khai vị", dishes: ["Gỏi cuốn tôm thịt", "Súp hải sản"] },
    { name: "Món chính", dishes: ["Cá tầm hấp xì dầu", "Bò lúc lắc khoai tây", "Tôm sú nướng bơ tỏi"] },
    { name: "Tráng miệng", dishes: ["Bánh flan"] },
  ],
  services: [
    { serviceName: "Âm thanh - ánh sáng", quantity: 1, basePrice: 800000, appliedPrice: 500000 },
    { serviceName: "MC chuyên nghiệp", quantity: 1, basePrice: 500000, appliedPrice: 300000 },
  ],
  promotions: [{ promotionName: "Giảm 10% tổng hóa đơn" }, { promotionName: "Tặng dịch vụ MC" }],
  originalPrice: 5000000,
  discountAmount: 500000,
  VAT: 500000,
  totalAmount: 5000000,
};

// Map trạng thái
const STATUS_TEXT = {
  0: "Đang chờ",
  1: "Đã xác nhận",
  2: "Đã hủy",
  3: "Đã đặt cọc",
  4: "Hoàn tất",
  5: "Từ chối",
};

const mockReviews = [
  {
    reviewId: "R001",
    bookingID: 101,
    customerName: "Nguyễn Văn B",
    rating: 5,
    content: "Dịch vụ tuyệt vời!",
    date: "2025-10-01T14:30:00",
    status: "Visible",
  },
  // ... các review khác
];

// Lọc review của booking này
const bookingReviews = mockReviews.filter(
  (r) => r.bookingID === mockBookingDetail.bookingID && r.status === "Visible"
);


export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState({ ...mockBookingDetail, bookingID: id ? Number(id) : mockBookingDetail.bookingID });

  // Helper format
  const formatVND = (val) => (Number(val ?? 0)).toLocaleString("vi-VN") + " ₫";
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("vi-VN") + " " + new Date(dateStr).toLocaleTimeString("vi-VN");

  const calcSubtotal = () => {
    const menuPrice = booking.restaurant?.menu?.price ?? 0;
    const hallPrice = booking.restaurant?.hall?.price ?? 0;
    const tables = booking.tableCount ?? 0;
    const servicesTotal = booking.services?.reduce((sum, s) => sum + (s.appliedPrice ?? 0) * (s.quantity ?? 1), 0) ?? 0;
    return hallPrice + menuPrice * tables + servicesTotal;
  };

  const totalAmount = calcSubtotal() - (booking.discountAmount ?? 0) + (booking.VAT ?? 0);

  // Trạng thái
  const status = booking.status;
  const isPending = status === 0;
  const isDeposit = status === 3;

  // Actions
  const handleMarkChecked = () => {
    if (window.confirm("Đánh dấu đã kiểm tra booking này?")) setBooking(prev => ({ ...prev, checked: 1 }));
  };
  const handleReject = () => {
    if (window.confirm("Bạn có chắc muốn từ chối booking này?")) setBooking(prev => ({ ...prev, status: 5 }));
  };
  const handleViewContract = () => navigate(`/partner/bookings/${booking.bookingID}/contract`);

  return (
    <PartnerLayout>
      <div className="p-3">
        <Button variant="secondary" className="mb-3 d-flex align-items-center gap-1" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Quay lại
        </Button>

        <Row className="g-3">
          {/* Left column: info + dishes + services + promotions */}
          <Col md={8}>
            <Card className="p-4 shadow-sm border-0 rounded-3 mb-3">
              <h5 className="fw-bold text-primary mb-3">Thông tin khách hàng</h5>
              <div className="mb-2"><strong>Tên:</strong> {booking.customer?.name ?? "-"}</div>
              <div className="mb-2"><strong>Điện thoại:</strong> {booking.customer?.phone ?? "-"}</div>
              <div className="mb-3"><strong>Email:</strong> {booking.customer?.email ?? "-"}</div>

              <h5 className="fw-bold text-primary mt-3 mb-2">Thông tin sự kiện</h5>
              <div className="mb-2"><strong>Nhà hàng:</strong> {booking.restaurant?.name ?? "-"}</div>
              <div className="mb-2"><strong>Sảnh:</strong> {booking.restaurant?.hall?.name ?? "-"} &nbsp;<span className="text-success">{formatVND(booking.restaurant?.hall?.price)}</span></div>
              <div className="mb-2"><strong>Menu:</strong> {booking.restaurant?.menu?.name ?? "-"} &nbsp;<span className="text-success">{formatVND(booking.restaurant?.menu?.price)}</span></div>
              <div className="mb-2"><strong>Ngày tổ chức:</strong> {booking.eventDate} ({booking.startTime} - {booking.endTime})</div>
              <div className="mb-2"><strong>Số bàn:</strong> {booking.tableCount ?? "-"}</div>
              <div className="mb-3"><strong>Yêu cầu đặc biệt:</strong> {booking.specialRequest ?? "-"}</div>

              <h5 className="fw-bold text-primary mt-3 mb-2">Danh sách món ăn</h5>
              {booking.dishCategories?.map((cat, idx) => (
                <div key={idx} className="mb-2">
                  <div className="text-secondary fw-semibold">{cat.name}</div>
                  <ul className="mb-1 ms-3">{cat.dishes?.map((d, i) => <li key={i}>{d}</li>)}</ul>
                </div>
              )) || <div className="text-muted">Không có món được chọn</div>}

              <h5 className="fw-bold text-primary mt-3 mb-2">Dịch vụ</h5>
              <Table bordered hover size="sm" className="mb-0 align-middle">
                <thead className="table-light">
                  <tr><th>Dịch vụ</th><th className="text-center" style={{ width: 90 }}>Số lượng</th><th className="text-end" style={{ width: 140 }}>Giá gốc</th><th className="text-end" style={{ width: 140 }}>Giá áp dụng</th></tr>
                </thead>
                <tbody>
                  {booking.services?.map((s, i) => (
                    <tr key={i}>
                      <td>{s.serviceName}</td>
                      <td className="text-center">{s.quantity ?? 1}</td>
                      <td className="text-end">{formatVND(s.basePrice)}</td>
                      <td className="text-end">{formatVND(s.appliedPrice)}</td>
                    </tr>
                  )) || <tr><td colSpan={4} className="text-center text-muted">Không có dịch vụ</td></tr>}
                </tbody>
              </Table>

              <h5 className="fw-bold text-primary mt-3 mb-2">Ưu đãi / Khuyến mãi</h5>
              <div>{booking.promotions?.map((p, i) => <Badge key={i} bg="success" className="me-2 mb-2 p-2">{p.promotionName}</Badge>) || <div className="text-muted">Không có ưu đãi</div>}</div>
            </Card>
          </Col>

          {/* Right column: payment + actions */}
          <Col md={4}>
            <Card className="p-4 shadow-sm border-0 rounded-3">
              <h5 className="fw-bold text-primary mb-3">Chi tiết thanh toán</h5>
              <Table borderless size="sm" className="mb-0 align-middle">
                <tbody>
                  <tr><td>Sảnh</td><td className="text-end">{formatVND(booking.restaurant?.hall?.price)}</td></tr>
                  <tr><td>Menu ({booking.tableCount} bàn)</td><td className="text-end">{formatVND((booking.restaurant?.menu?.price ?? 0) * booking.tableCount)}</td></tr>
                  <tr><td>Dịch vụ</td><td className="text-end">{formatVND(booking.services?.reduce((sum, s) => sum + (s.appliedPrice ?? 0) * (s.quantity ?? 1), 0))}</td></tr>
                  <tr className="fw-semibold"><td>Tạm tính</td><td className="text-end">{formatVND(calcSubtotal())}</td></tr>
                  <tr><td>Giảm giá</td><td className="text-end text-danger">-{formatVND(booking.discountAmount)}</td></tr>
                  <tr><td>VAT</td><td className="text-end">{formatVND(booking.VAT)}</td></tr>
                  <tr className="fw-bold fs-6 border-top"><td>Tổng cộng</td><td className="text-end text-success">{formatVND(totalAmount)}</td></tr>
                </tbody>
              </Table>

              <div className="d-flex flex-column gap-2 mt-4">
                {isPending && !booking.checked && <Button variant="primary" onClick={handleMarkChecked}>Đã kiểm tra</Button>}
                {isPending && <Button variant="danger" onClick={handleReject}>Từ chối</Button>}
                {isDeposit && <Button variant="success" onClick={handleViewContract}>Xem hợp đồng</Button>}
              </div>
            </Card>
            {bookingReviews.length > 0 && (
              <Card className="p-4 shadow-sm border-0 rounded-3 mt-3">
                <h5 className="fw-bold text-primary mb-3">Đánh giá của khách</h5>
                {bookingReviews.map((r) => (
                  <div key={r.reviewId} className="mb-3 p-3 border rounded-2">
                    <div className="d-flex align-items-center mb-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                      ))}
                    </div>
                    <div className="fw-semibold">{r.customerName}</div>
                    <div className="text-muted small">{new Date(r.date).toLocaleString("vi-VN")}</div>
                    <div>{r.content}</div>
                  </div>
                ))}
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </PartnerLayout>
  );
}