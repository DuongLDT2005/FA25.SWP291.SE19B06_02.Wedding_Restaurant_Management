import React from "react";
import useBooking from "../../../hooks/useBooking";
import { Form } from "react-bootstrap";

export default function CustomerInfoSection() {
  const { booking, setCustomerField } = useBooking();
  const { customer } = booking;

  return (
    <section className="p-4 bg-white border rounded shadow-sm mb-3">
      <h3 className="fw-bold mb-3" style={{ color: "#e11d48" }}>
        Thông tin khách hàng
      </h3>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Họ và tên</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập họ và tên"
            value={customer.name}
            onChange={(e) => setCustomerField("name", e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số điện thoại</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập số điện thoại"
            value={customer.phone}
            onChange={(e) => setCustomerField("phone", e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Nhập email"
            value={customer.email}
            onChange={(e) => setCustomerField("email", e.target.value)}
            required
          />
        </Form.Group>
      </Form>
    </section>
  );
}