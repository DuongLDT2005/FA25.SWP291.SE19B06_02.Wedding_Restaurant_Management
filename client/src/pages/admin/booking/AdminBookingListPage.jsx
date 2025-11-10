import React, { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../styles/BookingListStyle.css";
import { bookings as mockBookings } from "../../customer/ValueStore";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  0: { text: "ĐANG CHỜ", color: "#e67e22" },
  1: { text: "ĐÃ XÁC NHẬN", color: "#27ae60" },
  2: { text: "ĐÃ HỦY", color: "#c0392b" },
  3: { text: "ĐÃ ĐẶT CỌC", color: "#2980b9" },
  4: { text: "ĐÃ HOÀN THÀNH", color: "#2ecc71" },
};

export default function AdminBookingListPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(mockBookings);

  const handleOpenDetail = (booking) => {
    sessionStorage.setItem(`booking_${booking.bookingID}`, JSON.stringify(booking));
    navigate(`/admin/bookings/${booking.bookingID}`);
  };

  return (
    <AdminLayout title="Quản lý đặt tiệc">
      <div className="container py-4">
        <h2 className="fw-bold mb-4 text-primary">Danh sách đặt tiệc</h2>

        {bookings.length === 0 ? (
          <p className="text-center text-muted mt-4">Không có đặt tiệc nào.</p>
        ) : (
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            {/* --- Header Row --- */}
            <div
              className="d-flex px-4 py-3 fw-semibold bg-light text-muted border-bottom"
              style={{ fontSize: "0.9rem" }}
            >
              <div className="flex-grow-1 col-3">Nhà hàng</div>
              <div className="col-2">Ngày diễn ra</div>
              <div className="col-2">Người đặt</div>
              <div className="col-2">Loại tiệc</div>
              <div className="col-2 text-end">Giá tiền</div>
              <div className="col-1 text-center">Chi tiết</div>
            </div>

            {/* --- Booking Rows --- */}
            <div>
              {bookings.map((b, index) => (
                <div
                  key={b.bookingID}
                  className="d-flex align-items-center px-4 py-3 border-bottom"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {/* Nhà hàng + trạng thái */}
                  <div className="flex-grow-1 col-3">
                    <div className="fw-semibold">{b.restaurant?.name}</div>
                    <span
                      className="badge mt-1 px-3 py-1"
                      style={{
                        backgroundColor: STATUS_STYLES[b.status].color,
                        fontSize: "0.75rem",
                      }}
                    >
                      {STATUS_STYLES[b.status].text}
                    </span>
                  </div>

                  {/* Ngày diễn ra */}
                  <div className="col-2 text-muted">
                    {new Date(b.eventDate).toLocaleDateString("vi-VN")}
                  </div>

                  {/* Người đặt */}
                  <div className="col-2 text-muted">
                    {b.customer?.fullName || "—"}
                  </div>

                  {/* Loại tiệc */}
                  <div className="col-2 text-muted">
                    {b.eventType || "—"}
                  </div>

                  {/* Giá tiền */}
                  <div className="col-2 text-end fw-semibold text-primary">
                    ₫{b.price.toLocaleString("vi-VN")}
                  </div>

                  {/* Xem chi tiết */}
                  <div className="col-1 text-center">
                    <button
                      className="btn btn-outline-primary btn-sm rounded-pill px-3"
                      onClick={() => handleOpenDetail(b)}
                    >
                      <i className="fas fa-eye me-1"></i> Xem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
