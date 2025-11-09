import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Badge, Button, Alert } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import { payments as mockPayments } from "../../../customer/ValueStore";

export default function AdminPaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const STATUS = {
    0: { label: "Chờ xử lý", color: "warning", icon: "fa-clock" },
    1: { label: "Đã thanh toán", color: "success", icon: "fa-check-circle" },
    2: { label: "Thất bại", color: "danger", icon: "fa-times-circle" },
    3: { label: "Hoàn tiền", color: "secondary", icon: "fa-undo" },
  };

  const TYPE = {
    0: "Tiền cọc (30%)",
    1: "Thanh toán còn lại (70%)",
  };

  useEffect(() => {
    const found = mockPayments.find((p) => p.paymentID === parseInt(id, 10));
    setPayment(found || null);
  }, [id]);

  const formatCurrency = (v) => v.toLocaleString("vi-VN") + " ₫";
  const formatDate = (d) =>
    new Date(d).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleAction = (action) => {
    let newStatus = payment.status;
    if (action === "confirm") newStatus = 1;
    if (action === "reject") newStatus = 2;
    if (action === "refund") newStatus = 3;

    setPayment((prev) => ({ ...prev, status: newStatus }));
    setActionMsg(
      action === "confirm"
        ? "✅ Thanh toán đã được xác nhận thành công!"
        : action === "reject"
        ? "❌ Thanh toán bị từ chối."
        : "💸 Đã hoàn tiền cho khách hàng."
    );
  };

  if (!payment) {
    return (
      <AdminLayout title="Chi tiết thanh toán">
        <div className="container py-5 text-center text-muted">
          <i className="fas fa-exclamation-circle fa-2x mb-3"></i>
          <p>Không tìm thấy thông tin thanh toán.</p>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/admin/payments")}
          >
            ← Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const statusInfo = STATUS[payment.status];

  return (
    <AdminLayout title="Chi tiết thanh toán">
      <div className="container py-4">
        <Button
          variant="link"
          className="mb-3 text-decoration-none fw-semibold"
          onClick={() => navigate("/admin/payments")}
        >
          <i className="fas fa-arrow-left me-2"></i> Quay lại danh sách
        </Button>

        {actionMsg && (
          <Alert variant="info" className="rounded-4 shadow-sm text-center">
            {actionMsg}
          </Alert>
        )}

        {/* Card chi tiết thanh toán */}
        <Card className="border-0 shadow rounded-4 overflow-hidden">
          <Card.Header
            className="text-white d-flex justify-content-between align-items-center"
            style={{
              background:
                "linear-gradient(90deg, #0d6efd 0%, #6610f2 100%)",
              padding: "1rem 1.5rem",
            }}
          >
            <div>
              <h4 className="mb-0 fw-bold">
                Thanh toán #{payment.paymentID}
              </h4>
              <small className="opacity-75">
                Cập nhật lần cuối: {formatDate(payment.paymentDate)}
              </small>
            </div>
            <Badge bg={statusInfo.color} className="p-2 px-3 fs-6">
              <i className={`fas ${statusInfo.icon} me-2`}></i>
              {statusInfo.label}
            </Badge>
          </Card.Header>

          <Card.Body className="p-4">
            <div className="row g-4">
              {/* Thông tin khách hàng */}
              <div className="col-md-6">
                <div className="bg-light rounded-4 p-3 h-100 shadow-sm">
                  <h6 className="text-primary fw-bold mb-3">
                    <i className="fas fa-user me-2"></i>Thông tin khách hàng
                  </h6>
                  <p className="mb-2">
                    <strong>Tên:</strong> {payment.customerName}
                  </p>
                  <p className="mb-2">
                    <strong>Nhà hàng:</strong> {payment.restaurantName}
                  </p>
                  <p className="mb-0">
                    <strong>Mã đặt tiệc:</strong> #{payment.bookingID}
                  </p>
                </div>
              </div>

              {/* Chi tiết thanh toán */}
              <div className="col-md-6">
                <div className="bg-light rounded-4 p-3 h-100 shadow-sm">
                  <h6 className="text-primary fw-bold mb-3">
                    <i className="fas fa-credit-card me-2"></i>Chi tiết thanh toán
                  </h6>
                  <p className="mb-2">
                    <strong>Loại:</strong> {TYPE[payment.type]}
                  </p>
                  <p className="mb-2">
                    <strong>Phương thức:</strong> {payment.method}
                  </p>
                  <p className="mb-0">
                    <strong>Ngày thanh toán:</strong> {formatDate(payment.paymentDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Tổng tiền và nút hành động */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="text-center text-md-start mb-3 mb-md-0">
                <h5 className="fw-bold mb-0">
                  Tổng tiền:{" "}
                  <span className="text-success fs-4">
                    {formatCurrency(payment.amount)}
                  </span>
                </h5>
              </div>

              <div className="d-flex gap-2">
                {payment.status === 0 && (
                  <>
                    <Button
                      variant="success"
                      className="rounded-pill px-4"
                      onClick={() => handleAction("confirm")}
                    >
                      <i className="fas fa-check me-1"></i> Xác nhận
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="rounded-pill px-4"
                      onClick={() => handleAction("reject")}
                    >
                      <i className="fas fa-times me-1"></i> Từ chối
                    </Button>
                  </>
                )}

                {payment.status === 1 && (
                  <Button
                    variant="outline-secondary"
                    className="rounded-pill px-4"
                    onClick={() => handleAction("refund")}
                  >
                    <i className="fas fa-undo me-1"></i> Hoàn tiền
                  </Button>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
}
