import React from "react";
import { Card, Button, Badge, ListGroup } from "react-bootstrap";

export default function PromotionDetailPage({ promotion, onBack }) {
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Chi tiết khuyến mãi</h5>
        <Button variant="secondary" onClick={onBack}>
          ← Quay lại
        </Button>
      </Card.Header>
      <Card.Body>
        <h4>{promotion.name}</h4>
        <p className="text-muted">{promotion.description}</p>

        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Số bàn tối thiểu:</strong> {promotion.minTable}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Loại giảm giá:</strong>{" "}
            {promotion.discountType === 0 ? "Phần trăm" : "Miễn phí dịch vụ"}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Giá trị giảm:</strong>{" "}
            {promotion.discountType === 0
              ? `${promotion.discountValue}%`
              : "—"}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Thời gian:</strong> {promotion.startDate} →{" "}
            {promotion.endDate}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Dịch vụ áp dụng:</strong>{" "}
            {promotion.services?.length
              ? promotion.services.join(", ")
              : "Không có"}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Trạng thái:</strong>{" "}
            <Badge bg={promotion.status ? "success" : "secondary"}>
              {promotion.status ? "Hoạt động" : "Ngừng"}
            </Badge>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}