import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

export default function RestaurantProfile() {
  const [profile, setProfile] = useState({
    name: "Grand Palace Wedding Center",
    address: "123 Nguyễn Văn Linh, Hải Châu",
    phone: "0123 456 789",
    email: "contact@grandpalace.vn",
    description: "Trung tâm tiệc cưới sang trọng với nhiều sảnh lớn nhỏ.",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving profile:", profile);
    alert("Lưu thành công!");
    // TODO: gọi API update
  };

  return (
    <Card>
      <Card.Body>
        <h4 className="mb-3">Hồ sơ nhà hàng</h4>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="restaurantName">
                <Form.Label>Tên nhà hàng</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="restaurantPhone">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="restaurantEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="restaurantAddress">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="restaurantDescription">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={profile.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}