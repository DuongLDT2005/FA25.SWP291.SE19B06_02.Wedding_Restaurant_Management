import React from "react";
import { Gift, Smile } from "lucide-react";

const PromotionList = ({ restaurant }) => {
  return (
    <div className="mb-5">
      <h4 className="section-title mb-3" style={{ color: "#993344" }}>Ưu đãi</h4>
      <div className="d-flex flex-wrap gap-3">
        {restaurant.promotions?.length > 0 ? (
          restaurant.promotions.map((promo) => (
            <div
              key={promo.id}
              className="card shadow-sm p-3 flex-fill"
              style={{
                minWidth: "220px",
                borderRadius: "12px",
                position: "relative",
                background: "#fff3cd",
                transition: "transform 0.2s",
                border: "none"
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <Gift size={24} color="#fd7e14" />
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: "#d63384" }}>{promo.name}</h6>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                    {promo.startDate} → {promo.endDate}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Chưa có khuyến mãi</p>
        )}
      </div>
    </div>
  );
};

export default PromotionList;