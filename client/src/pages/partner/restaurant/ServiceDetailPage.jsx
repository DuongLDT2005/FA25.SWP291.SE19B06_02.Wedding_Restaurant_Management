import React, { useState } from "react";
import { Button, Card, Row, Col, Badge, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faToggleOn,
  faToggleOff,
  faSave,
  faEdit,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function ServiceDetailPage({ service, eventTypes = [], onBack }) {
  // --- Khai báo hook TRƯỚC ---
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState(service || {});

  // --- Nếu chưa có dữ liệu thì return sau ---
  if (!service) return null;

  const eventTypeName =
    eventTypes.find((e) => e.eventTypeID === editedService.eventTypeID)?.name ||
    "Không xác định";

  const isActive =
    editedService.status === 1 || editedService.status === "active";

  const toggleLabel = isActive
    ? { label: "Ngừng hoạt động", icon: faToggleOff, color: "danger" }
    : { label: "Kích hoạt", icon: faToggleOn, color: "success" };

  const handleChange = (field, value) => {
    setEditedService((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Cập nhật dịch vụ:", editedService);
    setIsEditing(false);
    alert("✅ Dịch vụ đã được cập nhật!");
  };

  return (
    <div className="p-3">
      <Card className="shadow-sm border-0 rounded-4 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="light" className="fw-semibold" onClick={onBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
          </Button>

          {!isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
            </Button>
          ) : (
            <div className="d-flex gap-2">
              <Button variant="success" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} /> Lưu
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setEditedService(service);
                  setIsEditing(false);
                }}
              >
                <FontAwesomeIcon icon={faTimes} /> Hủy
              </Button>
            </div>
          )}
        </div>

        {/* Nội dung */}
        <h4 className="fw-bold mb-3">{editedService.name}</h4>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tên dịch vụ</Form.Label>
              <Form.Control
                type="text"
                value={editedService.name}
                disabled={!isEditing}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giá dịch vụ (₫)</Form.Label>
              <Form.Control
                type="number"
                value={editedService.price}
                disabled={!isEditing}
                onChange={(e) =>
                  handleChange("price", parseInt(e.target.value) || 0)
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Đơn vị</Form.Label>
              <Form.Control
                type="text"
                value={editedService.unit}
                disabled={!isEditing}
                onChange={(e) => handleChange("unit", e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Loại sự kiện</Form.Label>
              <Form.Select
                value={editedService.eventTypeID}
                disabled={!isEditing}
                onChange={(e) =>
                  handleChange("eventTypeID", parseInt(e.target.value))
                }
              >
                {eventTypes.map((et) => (
                  <option key={et.eventTypeID} value={et.eventTypeID}>
                    {et.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <div>
                <Badge bg={isActive ? "success" : "secondary"}>
                  {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Badge>
                {isEditing && (
                  <Button
                    variant={toggleLabel.color}
                    size="sm"
                    className="ms-3"
                    onClick={() =>
                      handleChange("status", isActive ? 0 : 1)
                    }
                  >
                    <FontAwesomeIcon icon={toggleLabel.icon} />{" "}
                    {toggleLabel.label}
                  </Button>
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
    </div>
  );
}