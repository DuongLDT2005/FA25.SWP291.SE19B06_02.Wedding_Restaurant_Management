// File: src/pages/partner/Restaurant/ServiceCreatePage.jsx
import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function ServiceCreatePage({ onBack }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
    eventTypeID: "",
    imageURL: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tạo dịch vụ mới:", form);
    onBack();
  };

  return (
    <Card className="p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Thêm dịch vụ mới</h4>
        <Button
          variant="light"
          className="me-2"
          onClick={onBack}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
        </Button>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên dịch vụ</Form.Label>
          <Form.Control
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Đơn vị</Form.Label>
          <Form.Control
            name="unit"
            value={form.unit}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Loại sự kiện</Form.Label>
          <Form.Select
            name="eventTypeID"
            value={form.eventTypeID}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn loại sự kiện --</option>
            <option value="1">Tiệc cưới</option>
            <option value="2">Sinh nhật</option>
            <option value="3">Hội nghị</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="success" className="text-white">
          <FontAwesomeIcon icon={faPlus} /> Thêm dịch vụ
        </Button>
      </Form>
    </Card>
  );
}