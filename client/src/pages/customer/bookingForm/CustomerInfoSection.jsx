import React from "react";
import useBooking from "../../../hooks/useBooking";

export default function CustomerInfoSection() {
  const { booking, setCustomerField } = useBooking();
  const { customer } = booking;

  return (
    <section className="p-4 border rounded-xl bg-white shadow-sm">
      <h2 className="font-semibold mb-3">Thông tin khách hàng</h2>
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Họ và tên"
          value={customer.name}
          onChange={(e) => setCustomerField("name", e.target.value)}
        />
        <input
          placeholder="Số điện thoại"
          value={customer.phone}
          onChange={(e) => setCustomerField("phone", e.target.value)}
        />
        <input
          placeholder="Email"
          value={customer.email}
          onChange={(e) => setCustomerField("email", e.target.value)}
        />
        <input
          placeholder="Địa chỉ"
          value={customer.address}
          onChange={(e) => setCustomerField("address", e.target.value)}
        />
      </div>
    </section>
  );
}