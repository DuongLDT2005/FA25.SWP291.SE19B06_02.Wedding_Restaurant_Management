import React from "react";
import { Row, Col, Card, Badge } from "react-bootstrap";
import mock from "../../mock/partnerMock";

export default function ReviewManagement() {
  return (
    <Row className="g-3">
      <Col md={12}>
        <h2 className="mb-4 fw-bold" style={{ color: "#993344" }}>
          ⭐ Quản lý đánh giá
        </h2>
      </Col>

      {mock.reviews.length === 0 ? (
        <Col>
          <Card className="shadow-sm text-center p-4">
            <p className="text-muted">Chưa có đánh giá nào.</p>
          </Card>
        </Col>
      ) : (
        mock.reviews.map((review) => (
          <Col md={6} lg={4} key={review.id}>
            <Card className="shadow-sm h-100 border-0">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">{review.customer}</span>
                  <Badge bg={review.status === "Visible" ? "success" : "secondary"}>
                    {review.status}
                  </Badge>
                </Card.Title>

                <div className="mb-2">
                  <strong>Rating: </strong>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} style={{ color: "#FFD700" }}>⭐</span>
                  ))}
                </div>

                <p className="text-muted small">{review.comment}</p>
              </Card.Body>
            </Card>
          </Col>
        ))
      )}
    </Row>
  );
}
