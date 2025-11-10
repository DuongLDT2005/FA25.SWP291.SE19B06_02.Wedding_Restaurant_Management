import React from "react";
import useBooking from "../../../hooks/useBooking";

const DEFAULT_SERVICES = [
  { id: "mc", name: "MC", price: 500000 },
  { id: "photo", name: "Photographer", price: 1500000 },
  { id: "decoration", name: "Decoration", price: 1000000 },
  { id: "music", name: "Live Music", price: 1200000 },
];

export default function ServiceSelector() {
  const { booking, toggleService } = useBooking();
  const selectedIds = new Set(booking.services.map((s) => s.id));

  return (
    <div>
      <label className="small">Dịch vụ (tùy chọn)</label>
      <div className="flex gap-2 flex-wrap">
        {DEFAULT_SERVICES.map((svc) => {
          const active = selectedIds.has(svc.id);
          return (
            <button
              key={svc.id}
              type="button"
              className={`px-3 py-1 rounded ${active ? "bg-red-600 text-white" : "bg-gray-100"}`}
              onClick={() => toggleService(svc)}
            >
              {svc.name} — {svc.price.toLocaleString()}₫
            </button>
          );
        })}
      </div>
    </div>
  );
}