import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

export default function PromotionCreatePage({ onBack }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    minTable: 0,
    discountType: 0,
    discountValue: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Khuyến mãi mới đã được tạo (demo)");
    onBack();
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Tạo khuyến mãi mới</h5>
        <Button variant="secondary" onClick={onBack}>
          ← Quay lại
        </Button>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tên khuyến mãi</Form.Label>
                <Form.Control
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Số bàn tối thiểu</Form.Label>
                <Form.Control
                  type="number"
                  name="minTable"
                  value={form.minTable}
                  onChange={handleChange}
                  min={0}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Loại giảm giá</Form.Label>
                <Form.Select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                >
                  <option value={0}>Phần trăm</option>
                  <option value={1}>Miễn phí dịch vụ</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              {form.discountType === 0 && (
                <Form.Group>
                  <Form.Label>Giá trị giảm (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discountValue"
                    value={form.discountValue}
                    onChange={handleChange}
                    min={0}
                    max={100}
                  />
                </Form.Group>
              )}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Ngày bắt đầu</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Ngày kết thúc</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end">
            <Button type="submit" variant="primary">
              Lưu khuyến mãi
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}