import React from "react";
import CrudSection from "../../layouts/CrudSection";

export default function RestaurantServices() {
  const services = [
    { id: 1, name: "Trang trí hoa tươi", unit: "gói", price: "5,000,000 ₫", status: "active" },
    { id: 2, name: "Ban nhạc sống", unit: "buổi", price: "8,000,000 ₫", status: "active" },
  ];

  const columns = [
    { key: "name", label: "Tên dịch vụ" },
    { key: "unit", label: "Đơn vị" },
    { key: "price", label: "Giá" },
  ];

  const filters = [
    { value: "active", label: "Còn phục vụ" },
    { value: "inactive", label: "Ngừng phục vụ" },
  ];

  return <CrudSection title="Dịch vụ" columns={columns} data={services} filters={filters} />;
}
