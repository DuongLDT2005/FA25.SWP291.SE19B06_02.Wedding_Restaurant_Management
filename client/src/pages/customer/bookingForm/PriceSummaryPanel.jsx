import React, { useMemo } from "react";
import useBooking from "../../../hooks/useBooking";

const PriceSummaryPanel = () => {
  const { summary, booking } = useBooking();

  const dishSummaryText = useMemo(() => {
    const selected = new Set((booking.dishes || []).map((d) => d.name));
    const categories = Array.isArray(booking.menu?.categories) ? booking.menu.categories : [];
    const parts = [];
    let total = 0;
    categories.forEach((c) => {
      const count = (c.dishes || []).filter((n) => selected.has(n)).length;
      if (count > 0) {
        parts.push(`${c.name} ${count}`);
        total += count;
      }
    });
    if (parts.length === 0 && selected.size > 0) {
      total = selected.size;
    }
    if (total === 0) return "—";
    return `${total} món${parts.length ? ` (${parts.join(", ")})` : ""}`;
  }, [booking.dishes, booking.menu]);

  const serviceSummaryText = useMemo(() => {
    const svc = booking.services || [];
    if (!svc.length) return "—";
    if (svc.length <= 2) return svc.map((s) => s.name).join(", ");
    return `${svc[0].name}, ${svc[1].name} +${svc.length - 2}`;
  }, [booking.services]);

  return (
    <aside className="p-4 border rounded-xl bg-white shadow-sm">
      <h2 className="font-semibold mb-4">Booking Summary</h2>
      <ul className="space-y-2 text-sm">
        <li>Hall: {booking.bookingInfo.hall || "—"}</li>
        <li>Menu: {booking.menu?.name || "—"} {booking.menu?.price ? `— ${booking.menu.price.toLocaleString()}₫/khách` : ""}</li>
        <li>Món: {dishSummaryText}</li>
        <li>Dịch vụ: {serviceSummaryText}</li>
        <li>Promotion: {booking.appliedPromotion?.title || "—"}</li>
      </ul>

      <hr className="my-3" />
      <div className="text-sm">
        <div className="flex justify-between"><span>Guests:</span><span>{summary.guests ?? 0}</span></div>
        <div className="flex justify-between"><span>Subtotal:</span><span>{summary.subtotal?.toLocaleString() ?? 0}₫</span></div>
        <div className="flex justify-between"><span>Discount:</span><span>-{summary.discount?.toLocaleString() ?? 0}₫</span></div>
        <div className="flex justify-between"><span>VAT (8%):</span><span>{summary.vat?.toLocaleString() ?? 0}₫</span></div>
        <div className="flex justify-between font-semibold text-lg mt-2">
          <span>Total:</span><span>{summary.total?.toLocaleString() ?? 0}₫</span>
        </div>
      </div>
    </aside>
  );
};

export default PriceSummaryPanel;