import React from "react";
import { Row, Col, Card, ListGroup, Badge } from "react-bootstrap";
import mock from "../../mock/partnerMock";

export default function Notification() {
  // Map type trong mock -> category hiển thị
  const typeToCategory = {
    booking: "Booking",
    payment: "Finance",
    review: "Review",
    system: "System",
  };

  const categories = ["Booking", "Finance", "Review", "System"];

  return (
    <Row className="g-3">
      <Col md={12}>
        <h2 className="mb-4 text-primary fw-bold">📢 Thông báo</h2>
      </Col>

      {categories.map((cat) => {
        const filtered = mock.notifications.filter(
          (n) => typeToCategory[n.type] === cat
        );
        if (filtered.length === 0) return null;

        return (
          <Col md={6} lg={4} key={cat}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="d-flex align-items-center justify-content-between">
                  <span>
                    {cat === "Booking" && "📅 Đặt chỗ"}
                    {cat === "Finance" && "💰 Thanh toán"}
                    {cat === "Review" && "⭐ Đánh giá"}
                    {cat === "System" && "⚙️ Hệ thống"}
                  </span>
                  <Badge bg="secondary">{filtered.length}</Badge>
                </Card.Title>
                <ListGroup variant="flush">
                  {filtered.map((noti) => (
                    <ListGroup.Item key={noti.id}>
                      <div className="fw-semibold text-dark">{noti.title}</div>
                      <div className="small text-muted">{noti.message}</div>
                      <div className="text-end text-muted small">{noti.date}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
