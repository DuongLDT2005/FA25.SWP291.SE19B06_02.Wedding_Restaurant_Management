import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Image, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function RestaurantProfile({ restaurant, allEventTypes, readOnly = false }) {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    description: "",
    thumbnailURL: "",
    imageURLs: [],
    address: { number: "", street: "", ward: "" },
    eventTypes: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (restaurant) {
      setProfile({
        name: restaurant.name || "",
        phone: restaurant.contactPhone || "",
        email: restaurant.contactEmail || "",
        description: restaurant.description || "",
        thumbnailURL: restaurant.thumbnailURL || "",
        imageURLs: restaurant.imageURLs || [],
        address: {
          number: restaurant.address?.number || "",
          street: restaurant.address?.street || "",
          ward: restaurant.address?.ward || "",
        },
        eventTypes: restaurant.eventTypes
          ? restaurant.eventTypes.map((e) => e.eventTypeID)
          : [],
      });
    }
  }, [restaurant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["number", "street", "ward"].includes(name)) {
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, thumbnailURL: previewUrl }));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setProfile((prev) => ({
      ...prev,
      imageUrls: [...prev.imageURLs, ...newPreviews],
    }));
  };

  const handleSave = () => {
    console.log("Saving profile:", profile);
    alert("Lưu thành công!");
    // TODO: gọi API update
  };

  const handleViewImage = (url) => {
    setSelectedImage(url);
    setShowModal(true);
  };

  const handleDeleteImage = (url) => {
    if (window.confirm("Bạn có chắc muốn xóa ảnh này không?")) {
      setProfile((prev) => ({
        ...prev,
        imageURLs: prev.imageURLs.filter((img) => img !== url),
      }));
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4 className="mb-3">Hồ sơ nhà hàng</h4>
        <Form>
          {/* --- Thông tin cơ bản --- */}
          <Form.Group className="mb-3">
            <Form.Label>Tên nhà hàng</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={profile.name}
              onChange={(e) => handleChange(e)}
              disabled={readOnly}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={(e) => handleChange(e)}
                  disabled={readOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={(e) => handleChange(e)}
                  disabled={readOnly}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* --- Địa chỉ --- */}
          <Row className="mb-3">
            <Col md={2}>
              <Form.Group>
                <Form.Label>Số nhà</Form.Label>
                <Form.Control
                  type="text"
                  name="number"
                  value={profile.address.number}
                  onChange={handleChange}
                  disabled={readOnly}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Đường</Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  value={profile.address.street}
                  onChange={handleChange}
                  disabled={readOnly}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Phường / Xã</Form.Label>
                <Form.Control
                  type="text"
                  name="ward"
                  value={profile.address.ward}
                  onChange={handleChange}
                  disabled={readOnly}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* --- Sự kiện hỗ trợ --- */}
          <Form.Group className="mb-4">
            <Form.Label>Sự kiện hỗ trợ</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              {allEventTypes?.map((event) => (
                <Form.Check
                  key={event.eventTypeID}
                  type="checkbox"
                  label={event.name}
                  checked={profile.eventTypes.includes(event.eventTypeID)}
                  disabled={readOnly} // 👈 chỉ cần thêm dòng này
                  onChange={() => {
                    if (readOnly) return; // 👈 tránh xử lý nếu chỉ xem
                    setProfile((prev) => {
                      const selected = prev.eventTypes || [];
                      if (selected.includes(event.eventTypeID)) {
                        return {
                          ...prev,
                          eventTypes: selected.filter(
                            (id) => id !== event.eventTypeID
                          ),
                        };
                      } else {
                        return {
                          ...prev,
                          eventTypes: [...selected, event.eventTypeID],
                        };
                      }
                    });
                  }}
                />
              ))}
            </div>
          </Form.Group>

          {/* --- Mô tả --- */}
          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="description"
              value={profile.description}
              onChange={handleChange}
              disabled={readOnly}
            />
          </Form.Group>

          {/* --- Ảnh đại diện --- */}
          <Form.Group className="mb-4">
            <Form.Label>Ảnh đại diện</Form.Label>
            <div className="d-flex align-items-center gap-3">
              {profile.thumbnailURL ? (
                <Image
                  src={profile.thumbnailURL}
                  thumbnail
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                  onClick={() => handleViewImage(profile.thumbnailURL)}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center border rounded"
                  style={{
                    width: "150px",
                    height: "100px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <span className="text-muted small">Chưa có ảnh</span>
                </div>
              )}
              {!readOnly && (
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              )}
            </div>
          </Form.Group>

          {/* --- Hình ảnh khác --- */}
          <Form.Group className="mb-4">
            <Form.Label>Hình ảnh khác</Form.Label>
            {!readOnly && (
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
              />
            )}
            <Row className="mt-3">
              {profile.imageURLs?.length ? (
                profile.imageURLs.map((img, idx) => (
                  <Col md={3} key={idx} className="mb-3 text-center">
                    <Image
                      src={img}
                      thumbnail
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                      onClick={() => handleViewImage(img)}
                    />
                    {!readOnly && (
                      <Button
                        onClick={() => handleDeleteImage(img)}
                        variant="danger"
                        size="sm"
                        className="mt-2"
                      >
                        Xóa
                      </Button>
                    )}
                  </Col>
                ))
              ) : (
                <Col>
                  <em>Chưa có ảnh nào.</em>
                </Col>
              )}
            </Row>
          </Form.Group>

          {/* Ẩn nút Lưu nếu readOnly */}
          {!readOnly && (
            <Button variant="primary" onClick={handleSave}>
              Lưu
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}
