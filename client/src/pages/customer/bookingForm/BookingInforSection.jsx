import React from "react";
import DateInput from "../../../components/searchbar/DateInput";
import MenuSelectorModal from "./MenuSelectorModal";
import ServiceSelector from "./ServiceSelector";
import PromotionBadge from "./PromotionBadge";
import useBooking from "../../../hooks/useBooking";

const BookingInfoSection = () => {
  const { booking, setBookingField, setMenu } = useBooking();
  const { bookingInfo, menu } = booking;

  return (
    <section className="p-4 border rounded-xl bg-white shadow-sm">
      <h2 className="font-semibold mb-3">Booking Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <input name="restaurant" placeholder="Restaurant" value={bookingInfo.restaurant} disabled />
        <input name="hall" placeholder="Hall" value={bookingInfo.hall} disabled />
        <div>
          <label className="small">Ngày</label>
          <DateInput />
        </div>
        <div>
          <label className="small">Số bàn</label>
          <input
            name="tableCount"
            type="number"
            min={1}
            value={bookingInfo.tables}
            onChange={(e) => setBookingField("tables", Math.max(1, Number(e.target.value || 1)))}
          />
        </div>

        <div>
          <label className="small">Loại sự kiện</label>
          <select
            name="eventType"
            className="input"
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
            menus={[]} // backend menus can be passed or MenuSelectorModal can fetch itself
            onSelect={(selection) => {
              // selection: { menu, dishes }
              // MenuSelectorModal previously passed menu name; prefer to accept menu object
              // here assume selection.menu is object or name; set simple object
              setMenu(selection.menu || { name: selection.menu, price: selection.price || 0 });
            }}
          />
        </div>

        <ServiceSelector />
        <PromotionBadge />
      </div>
    </section>
  );
};

export default BookingInfoSection;