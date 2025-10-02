// File: RestaurantsPage.jsx
import React, { useState } from 'react';
import { Card, Button, Row, Col, Badge, Form, InputGroup } from 'react-bootstrap';
import AppLayout from "../../layouts/PartnerLayout";
import { useNavigate } from "react-router-dom";

const restaurants = [
  {
    id: 1,
    name: "Trung Tâm Tiệc Cưới Grand Palace",
    address: "123 Nguyễn Văn Linh, Hải Châu",
    status: "active",
    hallCount: 5,
    bookingCount: 12,
    thumbnailURL: "https://picsum.photos/400/300?random=1"
  },
  {
    id: 2,
    name: "Khu Nghỉ Dưỡng Tiệc Cưới Luxury",
    address: "456 Nguyễn Tất Thành, Thanh Khê",
    status: "inactive",
    hallCount: 3,
    bookingCount: 8,
    thumbnailURL: "https://picsum.photos/400/300?random=2"
  }
];

const RestaurantsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="mb-4">
        <Row className="g-2 align-items-center">
          {/* Ô tìm kiếm */}
          <Col xs={12} md={4}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Tìm nhà hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Col>

          {/* Bộ lọc */}
          <Col xs={12} md={3}>
            <Form.Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </Form.Select>
          </Col>

          {/* Nút thêm mới */}
          <Col xs={12} md="auto">
            <Button variant="primary" className="w-100 w-md-auto">
              + Thêm nhà hàng mới
            </Button>
          </Col>
        </Row>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredRestaurants.map(r => (
          <Col key={r.id}>
            <Card style={{ height: '100%' }}>
              <Card.Body>
                <Card.Title
                  style={{ cursor: "pointer", color: "#0d6efd" }}
                  onClick={() => navigate(`/partner/restaurants/${r.id}`)}
                >{r.name}
                </Card.Title>
                <Card.Text>{r.address}</Card.Text>
                <div className="d-flex justify-content-between mb-3">
                  <div>Số sảnh: <strong>{r.hallCount}</strong></div>
                  <div>Lượt đặt: <strong>{r.bookingCount}</strong></div>
                </div>
                <Badge bg={r.status === 'active' ? 'success' : 'danger'} className="mb-3">
                  {r.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </Badge>
                <div>
                  <Button variant="outline-primary" size="sm" className="me-2">Sửa</Button>
                  <Button variant="outline-danger" size="sm">Xóa</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </AppLayout>
  );
};

export default RestaurantsPage;
