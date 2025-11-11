import React, { useEffect } from "react";
import useBooking from "../../../hooks/useBooking";
import { calculatePrice } from "../../../services/bookingService";

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
    fetchPromotions(params).catch(() => {});
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
    <div>
      <label className="small">Khuyến mãi</label>
      <div className="mt-2">
        {booking.appliedPromotion ? (
          <div className="p-2 bg-green-50 border rounded">
            <strong>Đang áp dụng:</strong> {booking.appliedPromotion.title} — giảm {booking.appliedPromotion.type === "percent" ? `${booking.appliedPromotion.value}%` : `${booking.appliedPromotion.value}₫`}
          </div>
        ) : (
          <div className="text-sm text-muted">Chưa áp dụng khuyến mãi</div>
        )}
      </div>
    </div>
  );
}