import React from "react";
import useBooking from "../../../hooks/useBooking";

const PriceSummaryPanel = () => {
  const { summary, booking } = useBooking();

  return (
    <aside className="p-4 border rounded-xl bg-white shadow-sm">
      <h2 className="font-semibold mb-4">Booking Summary</h2>
      <ul className="space-y-2 text-sm">
        <li>Hall: {booking.bookingInfo.hall || "—"}</li>
        <li>Menu: {booking.menu?.name || "—"}</li>
        <li>Services: {booking.services.map((s) => s.name).join(", ") || "—"}</li>
        <li>Promotion: {booking.appliedPromotion?.title || "—"}</li>
      </ul>

      <hr className="my-3" />
      <div className="text-sm">
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