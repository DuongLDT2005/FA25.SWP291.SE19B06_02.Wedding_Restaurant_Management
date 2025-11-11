import React, { useState } from "react";
import {
  Table,
  Badge,
  Button,
  InputGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../../layouts/AdminLayout";
import { payments as mockPayments } from "../../../customer/ValueStore";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminPaymentListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [payments, setPayments] = useState(mockPayments);

  const formatCurrency = (v) => v.toLocaleString("vi-VN") + " ₫";

  const STATUS = {
    0: { label: "Chờ xử lý", color: "warning" },
    1: { label: "Đã thanh toán", color: "success" },
    2: { label: "Thất bại", color: "danger" },
    3: { label: "Hoàn tiền", color: "secondary" },
  };

  const TYPE = {
    0: "Tiền cọc (30%)",
    1: "Thanh toán còn lại (70%)",
  };

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.restaurantName.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || p.status.toString() === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout title="Quản lý thanh toán">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary mb-0">Danh sách thanh toán</h2>
          <div className="d-flex gap-2">
            {/* Bộ lọc trạng thái */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" size="sm">
                {filterStatus === "all"
                  ? "Tất cả trạng thái"
                  : STATUS[filterStatus]?.label}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterStatus("all")}>
                  Tất cả
                </Dropdown.Item>
                {Object.keys(STATUS).map((key) => (
                  <Dropdown.Item key={key} onClick={() => setFilterStatus(key)}>
                    {STATUS[key].label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Ô tìm kiếm */}
            <InputGroup size="sm" style={{ width: "260px" }}>
              <FormControl
                placeholder="Tìm khách hàng hoặc nhà hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outline-primary">
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
          </div>
        </div>

        {/* Bảng hiển thị */}
        {filtered.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="fas fa-info-circle fa-2x mb-2"></i>
            <p>Không tìm thấy thanh toán nào.</p>
          </div>
        ) : (
          <div className="table-responsive shadow-sm rounded-4">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-muted">
                <tr>
                  <th>#</th>
                  <th>Khách hàng</th>
                  <th>Nhà hàng</th>
                  <th>Loại thanh toán</th>
                  <th>Phương thức</th>
                  <th>Ngày thanh toán</th>
                  <th className="text-end">Số tiền</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr key={p.paymentID}>
                    <td>{idx + 1}</td>
                    <td>{p.customerName}</td>
                    <td>{p.restaurantName}</td>
                    <td>{TYPE[p.type]}</td>
                    <td>{p.method}</td>
                    <td>
                      {new Date(p.paymentDate).toLocaleDateString("vi-VN")}{" "}
                      {new Date(p.paymentDate).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="text-end fw-semibold">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="text-center">
                      <Badge bg={STATUS[p.status].color}>
                        {STATUS[p.status].label}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-pill"
                        onClick={() =>
                          navigate(`/admin/payments/${p.paymentID}`)
                        }
                      >
                        <i className="fas fa-eye me-1"></i> Xem
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
