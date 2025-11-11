import React from "react";
import useBooking from "../../../hooks/useBooking";

const DEFAULT_SERVICES = [
  { id: "mc", name: "MC", price: 500000 },
  { id: "photo", name: "Photographer", price: 1500000 },
  { id: "decoration", name: "Decoration", price: 1000000 },
  { id: "music", name: "Live Music", price: 1200000 },
];

export default function ServiceSelector({ services = [] }) {
  const { booking, toggleService } = useBooking();
  const selectedIds = new Set(booking.services.map((s) => s.id));
  const list = services && services.length > 0 ? services : DEFAULT_SERVICES;

  return (
    <div>
      <label className="small">Dịch vụ (tùy chọn)</label>
      <div className="flex gap-2 flex-wrap mt-1">
        {list.map((svc) => {
          const active = selectedIds.has(svc.id);
          return (
            <button
              key={svc.id}
              type="button"
              className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                active
                  ? "bg-rose-600 text-white border-rose-700 shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => toggleService(svc)}
              title={`${svc.name} — ${svc.price.toLocaleString()}₫`}
            >
              {svc.name} — {svc.price.toLocaleString()}₫
            </button>
          );
        })}
      </div>
    </div>
  );
}