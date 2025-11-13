import React, { useEffect } from "react";
import useBooking from "../../../hooks/useBooking";
import { calculatePrice } from "../../../services/bookingService";
import { Tag } from "lucide-react";
import { Badge } from "react-bootstrap";

/**
 * Hiển thị khuyến mãi đang áp dụng + gợi ý promotion kế cận
 * Cho phép áp dụng promotion gợi ý.
 */
export default function PromotionBadge() {
  const { booking, applyPromotion, fetchPromotions, recalcPrice } = useBooking();

  useEffect(() => {
    // fetch promotions relevant to current booking info
    const params = {
      eventType: booking.bookingInfo.eventType,
      date: booking.bookingInfo.date,
      tables: booking.bookingInfo.tables,
    };
    fetchPromotions(params).catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.bookingInfo.eventType, booking.bookingInfo.date, booking.bookingInfo.tables]);

  const suggestions = booking.promotions || [];

  // Auto apply the best promotion when promotions list or inputs change
  useEffect(() => {
    if (!suggestions.length) return;
    const base = { menu: booking.menu, tables: booking.bookingInfo?.tables, services: booking.services };
    let best = null;
    let bestDiscount = 0;
    suggestions.forEach((p) => {
      const { discount } = calculatePrice({ ...base, promotion: p });
      if (discount > bestDiscount) {
        best = p;
        bestDiscount = discount;
      }
    });
    // apply only if better or not set yet
    if (best && (!booking.appliedPromotion || booking.appliedPromotion?.id !== best.id)) {
      applyPromotion(best);
      // recalc after apply
      setTimeout(recalcPrice, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions, booking.menu, booking.bookingInfo?.tables, booking.services]);

  return (
    <div className="mt-3">
      <label className="fw-semibold mb-1">Khuyến mãi</label>
      {booking.appliedPromotion ? (
        <div className="d-flex align-items-center justify-content-between p-2 rounded border border-success bg-gradient-to-r" style={{ background: "linear-gradient(90deg, #d1fae5, #6ee7b7)" }}>
          <div className="d-flex align-items-center gap-2">
            <Tag size={16} className="text-success" />
            <div>
              <strong>{booking.appliedPromotion.title}</strong>
              <div className="text-sm text-success">
                {booking.appliedPromotion.description}
              </div>
              <p className="mb-0" style={{ fontSize: "0.75rem", opacity: 0.85 }}>
                {booking.appliedPromotion.startDate} → {booking.appliedPromotion.endDate}
              </p>
            </div>
          </div>
          <Badge bg="success" pill>
            Áp dụng
          </Badge>
        </div>
      ) : (
        <div className="text-muted">Chưa áp dụng khuyến mãi</div>
      )}
    </div>
  );
}