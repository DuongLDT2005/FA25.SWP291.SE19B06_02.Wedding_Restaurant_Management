import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";
import "../../../styles/BookingDetailsStyles.css";

export default function AdminBookingDetailsPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`booking_${bookingId}`);
      if (stored) {
        setBooking(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load booking", err);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  if (loading) {
    return (
      <AdminLayout title="Chi tiết đặt nhà hàng">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout title="Chi tiết đặt nhà hàng">
        <div className="alert alert-warning text-center mt-4">
          Không tìm thấy thông tin đặt tiệc.
        </div>
      </AdminLayout>
    );
  }

  const formatCurrency = (n) => n.toLocaleString("vi-VN") + " VNĐ";
  const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");

  return (
    <AdminLayout title={`Chi tiết đặt tiệc — ${booking.restaurant?.name || ""}`}>
      <div className="container py-4">
        {/* Header */}
        <div
          className="p-4 mb-4 rounded-3 text-white"
          style={{
            background: "linear-gradient(135deg, #993344 0%, #993344 100%)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-1">Chi tiết đặt tiệc</h3>
              <p className="mb-0">
                {booking.restaurant?.name} • {formatDate(booking.eventDate)}
              </p>
            </div>
            <span className="badge bg-light text-dark p-2 fs-6">
              {["Chờ", "Xác nhận", "Hủy", "Đã cọc", "Hoàn thành"][booking.status]}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Tổng quan
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "payments" ? "active" : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              Thanh toán
            </button>
          </li>
        </ul>

        {activeTab === "overview" && (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="mb-3">Thông tin khách hàng</h5>
              <p>
                <strong>Tên:</strong> {booking.customer?.fullName}
              </p>
              <p>
                <strong>Điện thoại:</strong> {booking.customer?.phone}
              </p>
              <p>
                <strong>Email:</strong> {booking.customer?.email}
              </p>
              <hr />
              <h5 className="mb-3">Thông tin sự kiện</h5>
              <p>
                <strong>Loại:</strong> {booking.eventType}
              </p>
              <p>
                <strong>Sảnh:</strong> {booking.hall?.name}
              </p>
              <p>
                <strong>Số bàn:</strong> {booking.tableCount}
              </p>
              <p>
                <strong>Yêu cầu:</strong> {booking.specialRequest || "Không có"}
              </p>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="mb-3">Lịch sử thanh toán</h5>
              {booking.payments?.length ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Loại thanh toán</th>
                      <th>Số tiền</th>
                      <th>Ngày thanh toán</th>
                      <th>Phương thức</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.payments.map((p, i) => (
                      <tr key={i}>
                        <td>{p.type === 0 ? "Tiền cọc" : "Còn lại"}</td>
                        <td>{formatCurrency(p.amount)}</td>
                        <td>{p.paymentDate ? formatDate(p.paymentDate) : "-"}</td>
                        <td>{p.paymentMethod || "Không rõ"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">Chưa có thanh toán nào.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
