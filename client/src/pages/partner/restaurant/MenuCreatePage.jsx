import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import mock from "../../../mock/partnerMock";

export default function MenuCreatePage({ onBack }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    dishes: [],
    status: "active",
  });

  const toggleDish = (id) => {
    setForm((prev) => ({
      ...prev,
      dishes: prev.dishes.includes(id)
        ? prev.dishes.filter((d) => d !== id)
        : [...prev.dishes, id],
    }));
  };

  const handleSubmit = () => {
    alert("Đã lưu thực đơn: " + form.name);
    onBack();
  };

  return (
    <div className="p-4">
      <Button variant="secondary" onClick={onBack} className="mb-3">
        ← Quay lại
      </Button>

      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-4">
            Thêm Thực đơn mới
          </h3>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên thực đơn</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giá trung bình</Form.Label>
              <Form.Control
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Chọn món ăn</Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {mock.dish.map((d) => (
                  <Form.Check
                    key={d.dishID}
                    type="checkbox"
                    label={d.name}
                    checked={form.dishes.includes(d.dishID)}
                    onChange={() => toggleDish(d.dishID)}
                  />
                ))}
              </div>
            </Form.Group>

            <div className="mt-4">
              <Button
                variant="primary"
                onClick={handleSubmit}
              >
                Lưu
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}