import React, { useState } from "react";
import { Table, Button, InputGroup, Form, Row, Col } from "react-bootstrap";

export default function CrudSection({ title, columns, data, filters = [] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Lọc dữ liệu
  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchesFilter = filter === "all" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <h4 className="mb-3">{title}</h4>

      {/* Thanh công cụ */}
      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder={`Tìm ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          {filters.length > 0 && (
            <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              {filters.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </Form.Select>
          )}
        </Col>
        <Col md={5} className="text-end">
          <Button variant="primary">+ Tạo mới</Button>
        </Col>
      </Row>

      {/* Bảng dữ liệu */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
              <td>
                <Button size="sm" variant="outline-primary" className="me-2">Sửa</Button>
                <Button size="sm" variant="outline-danger">Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}