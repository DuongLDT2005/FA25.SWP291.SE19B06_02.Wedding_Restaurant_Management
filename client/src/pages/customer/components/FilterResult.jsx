import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function FilterResult({ amenities = [] }) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [currentPromo, setCurrentPromo] = useState(0);
  const trackRef = useRef(null);
  const [localAmenities, setLocalAmenities] = useState(amenities);

  // Dữ liệu mẫu (fake từ script.sql)
  useEffect(() => {
    if (!amenities.length) {
      setLocalAmenities([
        { id: 1, name: "Máy lạnh" },
        { id: 2, name: "Hệ thống âm thanh" },
        { id: 3, name: "Hệ thống ánh sáng" },
        { id: 4, name: "Wi-Fi miễn phí" },
        { id: 5, name: "Bãi giữ xe" },
        { id: 6, name: "Thang máy" },
        { id: 7, name: "Hồ bơi" },
        { id: 8, name: "Camera an ninh" },
      ]);
    }
  }, [amenities]);

  const promotions = [
    "🎉 Giảm 25% khi đặt trước 30 ngày",
    "💖 Tặng voucher 2 triệu cho tiệc cưới",
    "🌟 Miễn phí trang trí cơ bản",
    "🍾 Tặng rượu champagne cho khách VIP",
    "📸 Gói chụp ảnh kỷ niệm miễn phí",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatVND = (val) => new Intl.NumberFormat("vi-VN").format(val);

  // Xử lý kéo slider thủ công
  const handleDrag = (e, type) => {
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.min(
      Math.max(0, (e.clientX - rect.left) / rect.width),
      1
    );
    const value = 5000000 + percent * (100000000 - 5000000);
    if (type === "min" && value < maxPrice - 1000000) setMinPrice(value);
    if (type === "max" && value > minPrice + 1000000) setMaxPrice(value);
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

  return (
    <aside>
      {/* 🎁 PROMOTION BOX */}
      <Card
        className="mb-4 shadow-sm"
        style={{
          border: "none",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #E11D48, #F43F5E)",
          color: "white",
          height: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          fontWeight: 600,
          fontSize: "15px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            transition: "transform 0.6s ease",
            transform: `translateY(-${currentPromo * 100}%)`,
          }}
        >
          {promotions.map((promo, index) => (
            <div
              key={index}
              style={{
                height: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <i className="bi bi-gift-fill" style={{ fontSize: "18px" }}></i>
              {promo}
            </div>
          ))}
        </div>
      </Card>

      {/* 💰 PRICE RANGE */}
      <Card
        className="mb-4 shadow-sm"
        style={{
          border: "none",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h5
          style={{
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "12px",
          }}
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

        {/* Hiển thị giá trị chọn */}
        <Row className="mt-3 text-center">
          <Col xs={6}>
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "20px",
                width: "100%", // ✅ chiếm hết cột (đều nhau)
                padding: "6px 10px",
                fontSize: "14px",
                fontWeight: "500",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {formatVND(minPrice)}{" "}
              <span style={{ color: "#6b7280" }}>VND</span>
            </div>
          </Col>

          <Col xs={6}>
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "20px",
                width: "100%",
                padding: "6px 10px",
                fontSize: "14px",
                fontWeight: "500",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {formatVND(maxPrice)}{" "}
              <span style={{ color: "#6b7280" }}>VND</span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* ⭐ RATING */}
      <Card
        className="mb-4 shadow-sm"
        style={{
          border: "none",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h5
          style={{
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          Đánh giá
        </h5>
        {[4.5, 4.0, 3.5, 3.0].map((r) => (
          <Form.Check
            key={r}
            type="checkbox"
            id={`rating-${r}`}
            label={
              <span>
                {"⭐".repeat(Math.floor(r))}{" "}
                <span style={{ color: "#6b7280" }}>{r}+</span>
              </span>
            }
            style={{
              marginBottom: "8px",
              fontSize: "14px",
              color: "#374151",
            }}
          />
        ))}
      </Card>

      {/* 🏨 AMENITIES */}
      <Card
        className="shadow-sm"
        style={{ border: "none", borderRadius: "12px", padding: "20px" }}
      >
        <h5
          style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px" }}
        >
          Tiện nghi
        </h5>

        {localAmenities.length > 0 ? (
          localAmenities.map((item) => (
            <Form.Check
              key={item.id}
              type="checkbox"
              id={`amenity-${item.id}`}
              label={<span>{item.name}</span>}
              style={{
                marginBottom: "8px",
                color: "#374151",
                fontSize: "14px",
              }}
            />
          ))
        ) : (
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            (Chưa có dữ liệu tiện nghi)
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
        }}
      >
        <i className="bi bi-arrow-clockwise" style={{ marginRight: "6px" }}></i>
        Đặt lại bộ lọc
      </Button>
    </aside>
  );
}
