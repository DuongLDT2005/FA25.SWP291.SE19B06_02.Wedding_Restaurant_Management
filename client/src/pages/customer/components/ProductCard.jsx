import React from "react";
import { useNavigate } from "react-router-dom"; // 👈 thêm dòng này
import { StarFill, GeoAltFill, PeopleFill } from "react-bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom"; // ✅ Thêm để link qua detail
import RatingStars from "../../../components/RatingStars";
import "../../../styles/ProductCardStyle.css";

const formatVND = (n) => new Intl.NumberFormat("vi-VN").format(Number(n) || 0);

export default function ProductCard({ venue }) {
  const navigate = useNavigate(); // 👈 dùng để chuyển trang

  const {
    restaurantID,
    name,
    thumbnailURL,
    avgRating,
    address,
    halls = [],
    restauranteventtypes = [],
  } = venue;

  // ✅ loại sự kiện (vd: Tiệc cưới)
  const eventType = restauranteventtypes?.[0]?.eventType?.name || "Sự kiện";

  // ✅ giá thấp nhất & sức chứa lớn nhất
  const minPrice = halls.length ? Math.min(...halls.map((h) => Number(h.price))) : 0;
  const maxCapacity = halls.length ? Math.max(...halls.map((h) => h.maxTable)) : null;

  // ✅ khi click card → điều hướng tới trang chi tiết
  const handleClick = () => {
    navigate(`/restaurants/${restaurantID}`);
  };

  return (
    <div
      className="card border-0 shadow-sm mb-4 venue-card"
      onClick={handleClick}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.01)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
      }}
    >
      <div className="row g-0">
        {/* Ảnh */}
        <div className="col-md-4">
          <div className="p-3 h-100 d-flex align-items-center">
            <img
              src={
                thumbnailURL ||
                venue.restaurantimages?.[0]?.imageURL ||
                "/default-image.jpg"
              }
              alt={name}
              className="venue-image"
              style={{
                borderRadius: "8px",
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Nội dung */}
        <div className="col-md-8">
          <div className="card-body d-flex flex-column h-100 p-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h3 className="venue-title me-3">{name}</h3>
              {avgRating && (
                <div className="rating-badge flex-shrink-0">
                  <StarFill size={16} color="#E11D48" />
                  <span>{Number(avgRating).toFixed(1)}</span>
                </div>
              )}
            </div>

            <p
              className="text-muted mb-2"
              style={{ fontSize: 14, fontStyle: "italic" }}
            >
              {eventType}
            </p>

            {address?.fullAddress && (
              <div className="location-text mb-2">
                <GeoAltFill size={14} color="#E11D48" />
                <span style={{ marginLeft: 6 }}>{address.fullAddress}</span>
              </div>
            )}

            {maxCapacity && (
              <div className="mb-3">
                <PeopleFill size={16} className="text-secondary" />
                <span className="text-secondary ms-2">Sức chứa tối đa:</span>
                <strong className="text-dark ms-1">{maxCapacity} bàn</strong>
              </div>
            )}

            <div className="mt-auto">
              {minPrice ? (
                <p className="price-current fw-bold text-danger">
                  Giá từ: {formatVND(minPrice)} VND
                </p>
              ) : (
                <p className="text-muted">Liên hệ để biết giá</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
