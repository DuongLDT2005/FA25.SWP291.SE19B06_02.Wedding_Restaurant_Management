import React from "react";
import CrudSection from "../../layouts/CrudSection";

export default function RestaurantServicePackages() {
  const packages = [
    { id: 1, name: "Gói Tiệc Cưới", status: "active" },
    { id: 2, name: "Gói Sinh Nhật", status: "active" },
    { id: 3, name: "Gói Liên Hoan", status: "inactive" },
  ];

  const columns = [
    { key: "name", label: "Tên gói dịch vụ" },
  ];

  const filters = [
    { value: "active", label: "Đang áp dụng" },
    { value: "inactive", label: "Ngừng áp dụng" },
  ];

  return <CrudSection title="Gói dịch vụ" columns={columns} data={packages} filters={filters} />;
}