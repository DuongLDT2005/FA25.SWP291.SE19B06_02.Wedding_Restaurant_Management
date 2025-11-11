import React from "react";
import {
  StarFill,
  GeoAltFill,
  PeopleFill,
  Percent,
} from "react-bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../../styles/ProductCardStyle.css";

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN").format(
    Number(String(n).replace(/[^\d]/g, ""))
  );

const priceRangeFromPrice = (priceStr) => {
  const base = Number(String(priceStr).replace(/[^\d]/g, "")) || 0;
  if (!base) return null;
  const min = Math.round(base * 0.9);
  const max = Math.round(base * 1.1);
  return { min, max };
};

const tablesFromCapacity = (capacityStr) => {
  const match = String(capacityStr || "").match(/(\d+)\s*-\s*(\d+)/);
  if (match) {
    const lo = Math.round(Number(match[1]) / 10);
    const hi = Math.round(Number(match[2]) / 10);
    return `${lo}–${hi} bàn`;
  }
  return capacityStr ? `${capacityStr} bàn` : "—";
};

export default function ProductCard({ venue }) {
  const promo =
    venue.promotion ||
    (Array.isArray(venue.promotions) && venue.promotions.length
      ? venue.promotions[0]
      : venue.discount
      ? `Mã ${venue.discount}`
      : null);

  const range =
    venue.priceMin && venue.priceMax
      ? { min: venue.priceMin, max: venue.priceMax }
      : priceRangeFromPrice(venue.price);

  const fakeOldMin = Math.round(range?.min * 1.1);
  const fakeOldMax = Math.round(range?.max * 1.1);

  return (
    <div className="card border-0 shadow-sm mb-4 venue-card">
      <div className="row g-0">
        {/* Cột ảnh */}
        <div className="col-md-4">
          <div className="p-3 h-100 d-flex align-items-center">
            <div className="image-container w-100">
              <img src={venue.image} alt={venue.name} className="venue-image" />
            </div>
          </div>
        </div>

        {/* Cột nội dung */}
        <div className="col-md-8">
          <div className="card-body d-flex flex-column h-100 p-3">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h3 className="venue-title me-3">{venue.name}</h3>
              {venue.rating != null && (
                <div className="rating-badge flex-shrink-0">
                  <StarFill size={16} />
                  <span>{venue.rating}</span>
                </div>
              )}
            </div>

            {/* Địa điểm */}
            {venue.location && (
              <div className="location-text mb-2">
                <GeoAltFill size={14} />
                <span>{venue.location}</span>
              </div>
            )}

            {/* Badge khuyến mãi - HIGHLIGHT */}
            {promo && (
              <div className="mb-3">
                <span className="promo-badge">
                  <span className="promo-icon">
                    <img
                      src="https://ik.imagekit.io/tvlk/image/imageResource/2024/11/26/1732635982113-3a6b6412ef32ce9edf2f58095a8954b4.png?tr=h-24,q-75,w-24"
                      alt="Khuyến mãi"
                      className="gear-image"
                      onError={(e) => {
                        // Fallback nếu ảnh lỗi
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "inline";
                      }}
                    />
                    {/* Fallback text nếu ảnh không load */}
                    <span style={{ display: "none" }}></span>
                  </span>
                  <span>{promo}</span>
                </span>
              </div>
            )}

            {/* Sức chứa */}
            <div className="mb-3">
              <span className="capacity-badge">
                <PeopleFill size={16} className="text-secondary" />
                <span className="text-secondary">Sức chứa:</span>
                <strong className="text-dark">
                  {tablesFromCapacity(venue.capacityTables || venue.capacity)}
                </strong>
              </span>
            </div>

            {/* Footer: Giá + Nút */}
            <div className="mt-auto">
              <div className="row align-items-end g-3">
                <div className="col-12 col-md-7">
                  {range ? (
                    <>
                      <p className="price-current">
                        {formatVND(range.min)} – {formatVND(range.max)} VND
                      </p>
                      <p className="price-old">
                        {formatVND(fakeOldMin)} – {formatVND(fakeOldMax)} VND
                      </p>
                    </>
                  ) : (
                    <p className="price-current">Liên hệ báo giá</p>
                  )}
                </div>
                <div className="col-12 col-md-5 text-md-end">
                  <button className="detail-btn w-100 w-md-auto">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
