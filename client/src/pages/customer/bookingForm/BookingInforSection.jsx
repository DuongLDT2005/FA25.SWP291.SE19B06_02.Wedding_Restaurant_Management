import React from "react";
import DateInput from "../../../components/searchbar/DateInput";
import MenuSelectorModal from "./MenuSelectorModal";
import ServiceSelector from "./ServiceSelector";
import PromotionBadge from "./PromotionBadge";
import useBooking from "../../../hooks/useBooking";

const BookingInfoSection = ({ menus = [], services = [] }) => {
  const { booking, setBookingField, setMenu, setDishes } = useBooking();
  const { bookingInfo, menu } = booking;

  return (
    <section className="p-3 border rounded-lg bg-white shadow-sm text-sm" style={{ fontSize: "0.95rem" }}>
      <h2 className="font-semibold mb-3" style={{ fontSize: "1.05rem" }}>Booking Information</h2>
      <div className="grid grid-cols-2 gap-3">
        <input name="restaurant" placeholder="Restaurant" value={bookingInfo.restaurant} disabled className="form-control bg-gray-50" />
        <input name="hall" placeholder="Hall" value={bookingInfo.hall} disabled className="form-control bg-gray-50" />
        <div>
          <label className="small">Ngày</label>
          <DateInput
            value={bookingInfo.date}
            onChange={(v) => setBookingField("date", v)}
            labelText="Ngày tổ chức"
          />
        </div>
        <div>
          <label className="small">Số bàn</label>
          <input
            name="tableCount"
            type="number"
            min={1}
            value={bookingInfo.tables}
            onChange={(e) => setBookingField("tables", Math.max(1, Number(e.target.value || 1)))}
            className="form-control"
          />
        </div>

        <div>
          <label className="small">Loại sự kiện</label>
          <select
            name="eventType"
            className="form-select"
            value={bookingInfo.eventType}
            onChange={(e) => setBookingField("eventType", e.target.value)}
          >
            <option>Tiệc cưới</option>
            <option>Sinh nhật</option>
            <option>Liên hoan</option>
            <option>Hội thảo</option>
            <option>Tiệc công ty</option>
          </select>
        </div>

        <div>
          <label className="small">Thực đơn</label>
          <MenuSelectorModal
            menus={menus}
            onSelect={(selection) => {
              // selection: { menu, dishes }
              const pickedMenu = selection.menu;
              const menuObj = typeof pickedMenu === 'string' ? { name: pickedMenu } : pickedMenu;
              setMenu(menuObj);
              // flatten dish names across categories
              const dishNames = Object.values(selection.dishes || {}).flat();
              setDishes(dishNames.map((d, idx) => ({ id: idx + 1, name: d })));
            }}
          />
        </div>

        <ServiceSelector services={services} />
        <PromotionBadge />
      </div>
    </section>
  );
};

export default BookingInfoSection;