import React, { useState, useRef } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import useAmenity from "../../../hooks/useAmenity";
import RatingStars from "../../../components/RatingStars";

export default function FilterResult() {
  const [minPrice, setMinPrice] = useState(5000000);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const trackRef = useRef(null);
  const { amenities, loading, error } = useAmenity();
  const formatVND = (val) => new Intl.NumberFormat("vi-VN").format(val);

  // Kéo slider
  const handleDrag = (e, type) => {
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.min(
      Math.max(0, (e.clientX - rect.left) / rect.width),
      1
    );
    const value = Math.min(
      100000000, // chặn max
      Math.max(5000000, 5000000 + percent * (100000000 - 5000000))
    );

    if (type === "min") setMinPrice(Math.min(value, maxPrice - 1000000));
    if (type === "max") setMaxPrice(Math.max(value, minPrice + 1000000));
  };

  const startDrag = (type) => {
    const move = (e) => handleDrag(e, type);
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const cardStyle = {
    border: "none",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
  };

  return (
    <aside>
      {/* 💰 PRICE RANGE */}
      <Card className="mb-4" style={cardStyle}>
        <h5
          style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}
        >
          Khoảng giá
        </h5>

        {/* Thanh trượt */}
        <div
          ref={trackRef}
          style={{
            position: "relative",
            height: "6px",
            backgroundColor: "#d1d5db",
            borderRadius: "3px",
            marginTop: "20px",
          }}
        >
          {/* Thanh chọn màu */}
          <div
            style={{
              position: "absolute",
              height: "6px",
              backgroundColor: "#0d6efd",
              borderRadius: "3px",
              left: `${(minPrice / 100000000) * 100}%`,
              width: `${((maxPrice - minPrice) / 100000000) * 100}%`,
            }}
          ></div>

          {/* Thumb Min */}
          <div
            onMouseDown={() => startDrag("min")}
            style={{
              position: "absolute",
              top: "-7px",
              left: `calc(${(minPrice / 100000000) * 100}% - 8px)`,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#0d6efd",
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
              cursor: "grab",
            }}
          ></div>

          {/* Thumb Max */}
          <div
            onMouseDown={() => startDrag("max")}
            style={{
              position: "absolute",
              top: "-7px",
              left: `calc(${(maxPrice / 100000000) * 100}% - 8px)`,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#0d6efd",
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
              cursor: "grab",
            }}
          ></div>
        </div>

        {/* Nhập giá trực tiếp */}
        <Row className="mt-3 text-center">
          {/* MIN PRICE */}
          <Col xs={6}>
            <div style={{ position: "relative" }}>
              <Form.Control
                value={formatVND(minPrice)} // hiển thị có dấu "."
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/\./g, ""); // bỏ dấu .
                  let val = parseInt(sanitized) || 0;

                  // Giới hạn
                  if (val < 5000000) val = 5000000; // min limit
                  if (val > maxPrice - 1000000) val = maxPrice - 1000000; // luôn nhỏ hơn max

                  setMinPrice(val);
                }}
                className="no-spinner"
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  textAlign: "left",
                  paddingRight: "40px",
                  borderRadius: "20px",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#6b7280",
                  pointerEvents: "none",
                }}
              >
                VND
              </span>
            </div>
          </Col>

          {/* MAX PRICE */}
          <Col xs={6}>
            <div style={{ position: "relative" }}>
              <Form.Control
                value={formatVND(maxPrice)} // ✅ hiển thị có dấu "."
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/\./g, ""); // bỏ dấu .
                  let val = parseInt(sanitized) || 0;

                  if (val > 100000000) val = 100000000;
                  if (val < minPrice + 1000000) val = minPrice + 1000000;
                  setMaxPrice(val);
                }}
                className="no-spinner"
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  textAlign: "left",
                  paddingRight: "40px",
                  borderRadius: "20px",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#6b7280",
                  pointerEvents: "none",
                }}
              >
                VND
              </span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* ⭐ RATING */}
      <Card className="mb-4" style={cardStyle}>
        <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
          Đánh giá
        </h5>
        {[5.0, 4.0, 3.0, 2.0, 1.0].map((r) => (
          <Form.Check
            key={r}
            type="checkbox"
            id={`rating-${r}`}
            label={
              <div className="d-flex align-items-center gap-1">
                <RatingStars rating={r} />
                <span style={{ fontSize: 14, color: "#6b7280" }}>{r}+</span>
              </div>
            }
            style={{ marginBottom: 8 }}
          />
        ))}
      </Card>

      {/* AMENITY CARD */}
      <Card className="mb-4" style={cardStyle}>
        <h5 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
          Tiện nghi
        </h5>

        {loading && <p>Đang tải...</p>}
        {error && <p style={{ color: "red" }}>Lỗi tải dữ liệu!</p>}

        {!loading && amenities.length > 0
          ? amenities.map((item) => (
              <Form.Check
                key={item.id}
                type="checkbox"
                id={`amenity-${item.id}`}
                label={item.name}
                style={{ marginBottom: 8, fontSize: 14 }}
              />
            ))
          : !loading && (
              <p style={{ fontSize: 14, color: "#6b7280" }}>
                (Không có tiện nghi)
              </p>
            )}
      </Card>

      {/* 🔄 RESET */}
      <Button
        variant="outline-danger"
        className="w-100 mt-3"
        style={{
          borderRadius: "8px",
          fontWeight: "600",
          padding: "12px",
          boxShadow: "0 2px 8px rgb(0,0,0,0.06)",
        }}
      >
        <i className="bi bi-arrow-clockwise" style={{ marginRight: "6px" }}></i>
        Đặt lại bộ lọc
      </Button>
    </aside>
  );
}
