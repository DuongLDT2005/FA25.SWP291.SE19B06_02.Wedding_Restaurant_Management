import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CBadge,
  CButton,
} from "@coreui/react";

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dữ liệu giả lập
  const bookings = [
    {
      id: 1001,
      customer: "Nguyễn Văn A",
      phone: "0909123456",
      restaurant: "Sunflower Wedding Hall",
      date: "2025-12-12",
      guests: 300,
      total: 12000000,
      status: "Pending",
      note: "Yêu cầu trang trí thêm hoa tươi",
    },
    {
      id: 1002,
      customer: "Trần Thị B",
      phone: "0988123456",
      restaurant: "Blue Ocean Center",
      date: "2025-11-01",
      guests: 200,
      total: 9500000,
      status: "Confirmed",
      note: "Cần thêm sân khấu ngoài trời",
    },
  ];

  const booking = bookings.find((b) => b.id === Number(id));

  if (!booking) {
    return (
      <CCard className="mb-4">
        <CCardHeader>Booking Detail</CCardHeader>
        <CCardBody>
          <p>❌ Không tìm thấy Booking #{id}</p>
          <CButton color="secondary" onClick={() => navigate(-1)}>
            Quay lại
          </CButton>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Booking Detail — #{booking.id}</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-3">
          <CCol sm={6}>
            <p><strong>Customer:</strong> {booking.customer}</p>
            <p><strong>Phone:</strong> {booking.phone}</p>
            <p><strong>Restaurant:</strong> {booking.restaurant}</p>
          </CCol>
          <CCol sm={6}>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Guests:</strong> {booking.guests}</p>
            <p><strong>Total:</strong> {booking.total.toLocaleString()} VND</p>
          </CCol>
        </CRow>

        <p>
          <strong>Status:</strong>{" "}
          <CBadge
            color={
              booking.status === "Confirmed"
                ? "success"
                : booking.status === "Pending"
                ? "warning"
                : "secondary"
            }
          >
            {booking.status}
          </CBadge>
        </p>

        <p><strong>Note:</strong> {booking.note || "Không có"}</p>

        <CButton color="secondary" onClick={() => navigate(-1)}>
          ← Quay lại danh sách
        </CButton>
      </CCardBody>
    </CCard>
  );
};

export default BookingDetailPage;
