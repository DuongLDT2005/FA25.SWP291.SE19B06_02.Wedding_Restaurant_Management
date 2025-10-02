import React from "react";
import CrudSection from "../../layouts/CrudSection";

export default function RestaurantHalls() {
  const halls = [
    { id: 1, name: "Sảnh A", capacity: 500, price: "20,000,000 ₫", status: "active" },
    { id: 2, name: "Sảnh B", capacity: 300, price: "15,000,000 ₫", status: "inactive" },
  ];

  const columns = [
    { key: "name", label: "Tên sảnh" },
    { key: "capacity", label: "Sức chứa" },
    { key: "price", label: "Giá thuê" },
  ];

  const filters = [
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Ngừng hoạt động" },
  ];

  return <CrudSection title="Sảnh tiệc" columns={columns} data={halls} filters={filters} />;
}