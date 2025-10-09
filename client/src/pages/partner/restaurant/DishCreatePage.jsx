import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import mock from "../../../mock/partnerMock";

export default function DishCreatePage({ onBack }) {
  const [form, setForm] = useState({
    name: "",
    categoryID: "",
    imageURL: "",
  });

  const categories = mock.dishCategories.filter((c) => c.status === 1);

  const handleSave = () => {
    alert("Món mới đã được lưu (demo)");
    onBack();
  };

  return (
    <div className="p-4">
      <h2>Thêm món ăn</h2>
      <Form className="mt-3" style={{ maxWidth: "500px" }}>
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
            <option value="">-- Chọn loại món --</option>
            {categories.map((c) => (
              <option key={c.categoryID} value={c.categoryID}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Ảnh món (URL)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập URL ảnh món..."
            value={form.imageURL}
            onChange={(e) => setForm({ ...form, imageURL: e.target.value })}
          />
        </Form.Group>
        <div className="d-flex gap-2 mt-4">
          <Button variant="secondary" onClick={onBack}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </div>
      </Form>
    </div>
  );
}