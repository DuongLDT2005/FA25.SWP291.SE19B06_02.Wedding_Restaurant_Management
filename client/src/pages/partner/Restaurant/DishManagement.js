import React, { useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import mock from "../../../mock/partnerMock";

export default function DishManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dishes, setDishes] = useState(
    mock.dish.map((d, i) => ({
      ...d,
      category: i % 2 === 0 ? "Khai vị" : "Món chính",
      status: i % 2 === 0 ? "Đang bán" : "Ngừng bán",
    }))
  );

  const [showModal, setShowModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Khai vị",
    status: "Đang bán",
  });

  const handleOpen = (dish = null) => {
    setEditingDish(dish);
    setForm(
      dish
        ? { ...dish }
        : { name: "", category: "Khai vị", status: "Đang bán" }
    );
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingDish) {
      setDishes(
        dishes.map((d) =>
          d.id === editingDish.id ? { ...editingDish, ...form } : d
        )
      );
    } else {
      setDishes([...dishes, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setDishes(dishes.filter((d) => d.id !== id));
  };

  const filtered = dishes.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || d.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4">
      <h2 className="mb-4" style={{ color: "#993344" }}>
        Quản lý món ăn
      </h2>

      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm món ăn..."
          style={{ width: "250px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="d-flex gap-2">
          <Form.Select
            style={{ width: "150px" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="Đang bán">Đang bán</option>
            <option value="Ngừng bán">Ngừng bán</option>
          </Form.Select>
          <Button
            style={{ backgroundColor: "#993344" }}
            onClick={() => handleOpen()}
          >
            Thêm món
          </Button>
        </div>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên món</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((dish, i) => (
            <tr key={dish.id}>
              <td>{i + 1}</td>
              <td>{dish.name}</td>
              <td>{dish.category}</td>
              <td>{dish.status}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleOpen(dish)}
                >
                  Sửa
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(dish.id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDish ? "Chỉnh sửa món ăn" : "Thêm món ăn"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              <Form.Label>Loại</Form.Label>
              <Form.Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Khai vị">Khai vị</option>
                <option value="Món chính">Món chính</option>
                <option value="Tráng miệng">Tráng miệng</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Đang bán">Đang bán</option>
                <option value="Ngừng bán">Ngừng bán</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button style={{ backgroundColor: "#993344" }} onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
