import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import mock from "../../../mock/partnerMock";

export default function DishDetailPage({ dish, onBack }) {
  const [form, setForm] = useState({ ...dish });
  const categories = mock.dishCategories.filter((c) => c.status === 1);

  const handleSave = () => {
    alert("Đã lưu thay đổi (demo)");
    onBack();
  };

  return (
    <div className="p-4">
      <Button variant="secondary" onClick={onBack} className="mb-3">
        ← Quay lại
      </Button>
      <Card className="shadow-lg p-4" style={{ maxWidth: "600px" }}>
        <Card.Img
          variant="top"
          src={form.imageURL}
          alt={form.name}
          style={{
            borderRadius: "10px",
            objectFit: "cover",
            height: "300px",
            marginBottom: "20px",
          }}
        />
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên món</Form.Label>
            <Form.Control
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Loại món</Form.Label>
            <Form.Select
              value={form.categoryID}
              onChange={(e) => setForm({ ...form, categoryID: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.categoryID} value={c.categoryID}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}
            >
              <option value={1}>Đang bán</option>
              <option value={0}>Ngừng bán</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex gap-2 mt-3">
            <Button variant="secondary" onClick={onBack}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Lưu
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}