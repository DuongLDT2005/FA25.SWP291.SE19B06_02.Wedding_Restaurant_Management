import React, { useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import AdminLayout from "../../../layouts/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminNotificationPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      title: "Đơn đặt mới từ Nguyễn Văn A",
      message: "Khách hàng đã đặt tiệc tại Sunshine Wedding Restaurant.",
      date: "2025-11-06T09:45:00",
      status: "unread",
      icon: "fa-calendar-check",
      color: "primary",
    },
    {
      id: 2,
      type: "payment",
      title: "Thanh toán thành công",
      message: "Đơn #102 đã được thanh toán đầy đủ.",
      date: "2025-11-06T10:15:00",
      status: "unread",
      icon: "fa-credit-card",
      color: "success",
    },
    {
      id: 3,
      type: "report",
      title: "Báo cáo mới từ khách hàng",
      message: "Khách hàng Trần Thị B gửi khiếu nại về dịch vụ tại Moonlight Hall.",
      date: "2025-11-05T21:10:00",
      status: "read",
      icon: "fa-exclamation-triangle",
      color: "danger",
    },
  ]);

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: "read" } : n
      )
    );

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <AdminLayout title="Thông báo hệ thống">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary mb-0">Thông báo</h2>
          <Badge bg="secondary">
            {notifications.filter((n) => n.status === "unread").length} chưa đọc
          </Badge>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="fas fa-bell-slash fa-2x mb-3"></i>
            <p>Không có thông báo nào.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`shadow-sm border-0 rounded-4 ${
                  n.status === "unread" ? "border-start border-4 border-primary" : ""
                }`}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div
                      className={`me-3 d-flex align-items-center justify-content-center rounded-circle bg-${n.color} text-white`}
                      style={{ width: 45, height: 45 }}
                    >
                      <i className={`fas ${n.icon} fa-lg`}></i>
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold">{n.title}</h6>
                      <p className="text-muted small mb-0">{n.message}</p>
                      <small className="text-muted">
                        {new Date(n.date).toLocaleString("vi-VN")}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    {n.status === "unread" && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => markAsRead(n.id)}
                      >
                        <i className="fas fa-check"></i> Đánh dấu đã đọc
                      </Button>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteNotification(n.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
