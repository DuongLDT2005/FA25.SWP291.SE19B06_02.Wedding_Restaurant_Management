import React, { useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import mock from "../../../mock/partnerMock";

export default function MenuManagement() {
  const [search, setSearch] = useState("");
  const [menus, setMenus] = useState(
    mock.menu.map((m, i) => ({
      ...m,
      category: i % 2 === 0 ? "Tiêu chuẩn" : "Cao cấp",
      status: i % 2 === 0 ? "Đang hoạt động" : "Ngừng hoạt động",
    }))
  );
  const [allDishes] = useState(mock.dish);
  const [showModal, setShowModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [form, setForm] = useState({ name: "", dishes: [], category: "Tiêu chuẩn", status: "Đang hoạt động" });
  const [filter, setFilter] = useState("all");

  const handleOpen = (menu = null) => {
    setEditingMenu(menu);
    setForm(
      menu
        ? { ...menu }
        : { name: "", dishes: [], category: "Tiêu chuẩn", status: "Đang hoạt động" }
    );
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingMenu) {
      setMenus(
        menus.map((m) =>
          m.id === editingMenu.id ? { ...editingMenu, ...form } : m
        )
      );
    } else {
      setMenus([...menus, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setMenus(menus.filter((m) => m.id !== id));
  };

  const toggleDish = (dishId) => {
    if (form.dishes.includes(dishId)) {
      setForm({ ...form, dishes: form.dishes.filter((d) => d !== dishId) });
    } else {
      setForm({ ...form, dishes: [...form.dishes, dishId] });
    }
  };

  const filtered = menus.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4">
      <h2 className="mb-4" style={{ color: "#993344" }}>
        Quản lý Thực đơn
      </h2>

      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm thực đơn..."
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
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Ngừng hoạt động">Ngừng hoạt động</option>
          </Form.Select>
          <Button
            style={{ backgroundColor: "#993344" }}
            onClick={() => handleOpen()}
          >
            Thêm Thực đơn
          </Button>
        </div>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên Thực đơn</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th>Món ăn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((menu, i) => (
            <tr key={menu.id}>
              <td>{i + 1}</td>
              <td>{menu.name}</td>
              <td>{menu.category}</td>
              <td>{menu.status}</td>
              <td>
                {menu.dishes
                  .map((id) => allDishes.find((d) => d.id === id)?.name)
                  .join(", ")}
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleOpen(menu)}
                >
                  Sửa
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(menu.id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingMenu ? "Chỉnh sửa Thực đơn" : "Thêm Thực đơn"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên Thực đơn</Form.Label>
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
                <option value="Tiêu chuẩn">Tiêu chuẩn</option>
                <option value="Cao cấp">Cao cấp</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Ngừng hoạt động">Ngừng hoạt động</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Chọn món ăn</Form.Label>
              <div className="d-flex flex-wrap">
                {allDishes.map((dish) => (
                  <Form.Check
                    key={dish.id}
                    type="checkbox"
                    className="me-3"
                    label={dish.name}
                    checked={form.dishes.includes(dish.id)}
                    onChange={() => toggleDish(dish.id)}
                  />
                ))}
              </div>
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
