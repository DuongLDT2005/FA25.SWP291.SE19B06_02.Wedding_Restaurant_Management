import React, { useState } from 'react';
import { Table, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import AppLayout from "../../layouts/PartnerLayout";

const bookings = [
  {
    id: 101,
    customerName: "Nguyễn Văn A",
    restaurantName: "Grand Palace Wedding Center",
    eventDate: "15/12/2023",
    guests: 200,
    status: "confirmed",
    total: 185000000,
  },
  {
    id: 102,
    customerName: "Lê Văn C",
    restaurantName: "Luxury Wedding Resort",
    eventDate: "20/12/2023",
    guests: 150,
    status: "pending",
    total: 150000000,
  },
  {
    id: 103,
    customerName: "Mai Thị F",
    restaurantName: "Royal Wedding Hall",
    eventDate: "22/12/2023",
    guests: 180,
    status: "completed",
    total: 130000000,
  },
];

const statusVariant = (status) => {
  switch (status) {
    case 'confirmed': return 'success';
    case 'pending': return 'warning';
    case 'completed': return 'primary';
    default: return 'secondary';
  }
};

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <h2 className="mb-4">Quản lý Đặt Tiệc</h2>

      {/* Search & Filter */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm khách hàng hoặc nhà hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Nhà hàng</th>
            <th>Ngày tổ chức</th>
            <th>Số khách</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map(b => (
            <tr key={b.id}>
              <td>#{b.id}</td>
              <td>{b.customerName}</td>
              <td>{b.restaurantName}</td>
              <td>{b.eventDate}</td>
              <td>{b.guests}</td>
              <td>{b.total.toLocaleString('vi-VN')} ₫</td>
              <td>
                <Badge bg={statusVariant(b.status)}>
                  {b.status === 'confirmed' ? 'Đã xác nhận' : b.status === 'pending' ? 'Chờ xác nhận' : 'Đã hoàn thành'}
                </Badge>
              </td>
              <td>
                <Button variant="link" size="sm" className="me-2">Xem</Button>
                {b.status === 'pending' && <Button variant="success" size="sm">Xác nhận</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {filteredBookings.length === 0 && (
        <p className="text-center mt-3">Không tìm thấy đơn đặt phù hợp.</p>
      )}
    </AppLayout>
  );
};

export default BookingsPage;
