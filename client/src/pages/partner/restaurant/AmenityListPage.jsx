import React, { useState } from "react";
import { Card, Button, Form, Row, Col, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import mock from "../../../mock/partnerMock";

export default function AmenityListPage() {
  // === Giả lập dữ liệu từ mock ===
  const [allAmenities, setAllAmenities] = useState(mock.amenities);
  const [restaurantAmenities, setRestaurantAmenities] = useState([1, 4]); // Nhà hàng hiện có Wifi + Âm thanh ánh sáng

  const [isEditing, setIsEditing] = useState(false);

  // === Bật/tắt tiện ích trong chế độ chỉnh sửa ===
  const handleToggleAmenity = (amenityID) => {
    if (!isEditing) return;

    setRestaurantAmenities((prev) =>
      prev.includes(amenityID)
        ? prev.filter((id) => id !== amenityID)
        : [...prev, amenityID]
    );
  };

  // === Lưu tiện ích ===
  const handleSave = () => {
    console.log("Lưu tiện ích:", restaurantAmenities);
    setIsEditing(false);
    alert("✅ Tiện ích của nhà hàng đã được cập nhật!");
  };

  // === Hủy chỉnh sửa ===
  const handleCancel = () => {
    setRestaurantAmenities([1, 4]); // Hoàn lại dữ liệu gốc
    setIsEditing(false);
  };

  return (
    <div className="p-3">
      <Card className="shadow-sm border-0 rounded-4 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Tiện ích của nhà hàng</h4>

          {!isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
            </Button>
          ) : (
            <div className="d-flex gap-2">
              <Button variant="success" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} /> Lưu
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} /> Hủy
              </Button>
            </div>
          )}
        </div>

        <p className="text-muted mb-4">
          Chọn các tiện ích mà nhà hàng của bạn đang cung cấp. Các tiện ích này
          được tạo bởi Quản trị viên hệ thống.
        </p>

        {/* Danh sách amenity */}
        <Row>
          {allAmenities.map((amenity) => {
            const isChecked = restaurantAmenities.includes(amenity.amenityID);
            const isActive = amenity.status === 1;

            return (
              <Col key={amenity.amenityID} md={6} lg={4} className="mb-3">
                <Card
                  className={`p-3 border-0 shadow-sm rounded-3 d-flex flex-row align-items-center justify-content-between ${
                    !isActive ? "opacity-50" : ""
                  }`}
                  style={{ cursor: isEditing ? "pointer" : "default" }}
                  onClick={() => handleToggleAmenity(amenity.amenityID)}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check
                      type="checkbox"
                      checked={isChecked}
                      disabled={!isEditing || !isActive}
                      onChange={() => handleToggleAmenity(amenity.amenityID)}
                    />
                    <span className="fw-semibold">{amenity.name}</span>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {allAmenities.length === 0 && (
          <p className="text-muted fst-italic text-center mt-3">
            Chưa có tiện ích nào được tạo bởi quản trị viên.
          </p>
        )}
      </Card>
    </div>
  );
}
