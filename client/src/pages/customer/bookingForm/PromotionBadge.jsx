import React, { useEffect } from "react";
import useBooking from "../../../hooks/useBooking";

/**
 * Hiển thị khuyến mãi đang áp dụng + gợi ý promotion kế cận
 * Cho phép áp dụng promotion gợi ý.
 */
export default function PromotionBadge() {
  const { booking, applyPromotion, fetchPromotions, recalcPrice, summary } = useBooking();

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

  return (
    <div>
      <label className="small">Khuyến mãi</label>
      <div className="mt-2">
        {booking.appliedPromotion ? (
          <div className="p-2 bg-green-50 border rounded">
            <strong>Đang áp dụng:</strong> {booking.appliedPromotion.title} — giảm{" "}
            {booking.appliedPromotion.type === "percent" ? `${booking.appliedPromotion.value}%` : `${booking.appliedPromotion.value}₫`}
          </div>
        ) : (
          <div className="text-sm text-muted">Chưa áp dụng khuyến mãi</div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-muted mb-1">Gợi ý:</div>
            <div className="flex gap-2">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="px-3 py-1 rounded bg-yellow-100"
                  onClick={() => {
                    applyPromotion(p);
                    // recalc price after apply
                    setTimeout(recalcPrice, 0);
                  }}
                >
                  {p.title} {p.type === "percent" ? `- ${p.value}%` : `- ${p.value}₫`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-sm">
        <div>Subtotal: {summary.subtotal?.toLocaleString() ?? 0}₫</div>
        <div>Discount: -{summary.discount?.toLocaleString() ?? 0}₫</div>
        <div>VAT: {summary.vat?.toLocaleString() ?? 0}₫</div>
        <div className="font-semibold">Total: {summary.total?.toLocaleString() ?? 0}₫</div>
      </div>
    </div>
  );
}