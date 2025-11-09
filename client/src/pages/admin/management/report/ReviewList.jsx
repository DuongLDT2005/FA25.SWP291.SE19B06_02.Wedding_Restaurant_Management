import React, { useState } from "react";
import { Table, Badge, Button, Dropdown, InputGroup, FormControl } from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { reviews as mockReviews } from "../../../customer/ValueStore"; // nếu chưa có thì bạn có thể mock data ở đây

export default function AdminReviewListPage() {
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [reviews, setReviews] = useState(mockReviews || []);

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.restaurantName.toLowerCase().includes(search.toLowerCase());
    const matchRating =
      filterRating === "all" || r.rating === parseInt(filterRating);
    return matchSearch && matchRating;
  });

  const handleToggleVisibility = (id) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.reviewID === id ? { ...r, visible: !r.visible } : r
      )
    );
  };

  return (
    <AdminLayout title="Quản lý đánh giá">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary mb-0">Đánh giá của khách hàng</h2>

          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" size="sm">
                {filterRating === "all" ? "Tất cả sao" : `${filterRating} sao`}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterRating("all")}>Tất cả</Dropdown.Item>
                {[5, 4, 3, 2, 1].map((r) => (
                  <Dropdown.Item key={r} onClick={() => setFilterRating(r)}>
                    {r} sao
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
            <i className="fas fa-comments fa-2x mb-2"></i>
            <p>Chưa có đánh giá nào.</p>
          </div>
        ) : (
          <div className="table-responsive shadow-sm rounded-4">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-muted">
                <tr>
                  <th>#</th>
                  <th>Khách hàng</th>
                  <th>Nhà hàng</th>
                  <th>Đánh giá</th>
                  <th>Bình luận</th>
                  <th>Ngày đăng</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => (
                  <tr key={r.reviewID}>
                    <td>{idx + 1}</td>
                    <td>{r.customerName}</td>
                    <td>{r.restaurantName}</td>
                    <td>{"⭐".repeat(r.rating)}</td>
                    <td>{r.comment}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="text-center">
                      <Badge bg={r.visible ? "success" : "secondary"}>
                        {r.visible ? "Hiển thị" : "Ẩn"}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button
                        variant={r.visible ? "outline-danger" : "outline-success"}
                        size="sm"
                        className="rounded-pill"
                        onClick={() => handleToggleVisibility(r.reviewID)}
                      >
                        <i className={`fas ${r.visible ? "fa-eye-slash" : "fa-eye"} me-1`}></i>
                        {r.visible ? "Ẩn" : "Hiện"}
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
