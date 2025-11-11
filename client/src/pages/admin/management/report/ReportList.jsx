import React, { useState } from "react";
import { Table, Badge, Button, Dropdown, InputGroup, FormControl } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { reports as mockReports } from "../../../customer/ValueStore"; // hoặc tạo file mock riêng

export default function AdminReportListPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [reports, setReports] = useState(mockReports || []);

  const STATUS = {
    0: { label: "Chưa xử lý", color: "warning" },
    1: { label: "Đã xử lý", color: "success" },
    2: { label: "Đã bỏ qua", color: "secondary" },
  };

  const filtered = reports.filter((r) => {
    const matchSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.restaurantName.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || r.status.toString() === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAction = (id, action) => {
    setReports((prev) =>
      prev.map((r) =>
        r.reportID === id
          ? {
              ...r,
              status: action === "resolve" ? 1 : 2,
            }
          : r
      )
    );
  };

  return (
    <AdminLayout title="Báo cáo & Khiếu nại">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-danger mb-0">Danh sách báo cáo</h2>

          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-danger" size="sm">
                {filterStatus === "all"
                  ? "Tất cả trạng thái"
                  : STATUS[filterStatus].label}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterStatus("all")}>Tất cả</Dropdown.Item>
                {Object.keys(STATUS).map((key) => (
                  <Dropdown.Item key={key} onClick={() => setFilterStatus(key)}>
                    {STATUS[key].label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <InputGroup size="sm" style={{ width: "250px" }}>
              <FormControl
                placeholder="Tìm khách hàng hoặc nhà hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="fas fa-exclamation-triangle fa-2x mb-2"></i>
            <p>Không có báo cáo nào.</p>
          </div>
        ) : (
          <div className="table-responsive shadow-sm rounded-4">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-muted">
                <tr>
                  <th>#</th>
                  <th>Khách hàng</th>
                  <th>Nhà hàng</th>
                  <th>Lý do</th>
                  <th>Ngày gửi</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => (
                  <tr key={r.reportID}>
                    <td>{idx + 1}</td>
                    <td>{r.customerName}</td>
                    <td>{r.restaurantName}</td>
                    <td>{r.reason}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="text-center">
                      <Badge bg={STATUS[r.status].color}>
                        {STATUS[r.status].label}
                      </Badge>
                    </td>
                    <td className="text-center">
                      {r.status === 0 ? (
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            className="rounded-pill"
                            onClick={() => handleAction(r.reportID, "resolve")}
                          >
                            <i className="fas fa-check me-1"></i> Xử lý
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="rounded-pill"
                            onClick={() => handleAction(r.reportID, "ignore")}
                          >
                            <i className="fas fa-times me-1"></i> Bỏ qua
                          </Button>
                        </div>
                      ) : (
                        <Badge bg={STATUS[r.status].color} className="px-3 py-2">
                          {STATUS[r.status].label}
                        </Badge>
                      )}
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
