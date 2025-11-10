import React, { useState } from "react";
import CrudSection from "../../../layouts/CrudSection";
import HallProfile from "./HallDetailPage";
import HallCreate from "./HallCreatePage";

export default function HallListPage({ readOnly = false }) {
  const [activeHall, setActiveHall] = useState(null);
  const [creating, setCreating] = useState(false);
  const [halls, setHalls] = useState([
    { id: 1, name: "Sảnh A", capacity: 500, area: 600, price: "20,000,000 ₫", status: "active" },
    { id: 2, name: "Sảnh B", capacity: 300, area: 400, price: "15,000,000 ₫", status: "inactive" },
  ]);

  const columns = [
    { key: "name", label: "Tên sảnh" },
    { key: "capacity", label: "Sức chứa (người)" },
    { key: "area", label: "Diện tích (m²)" },
    { key: "price", label: "Giá thuê" },
    { key: "status", label: "Trạng thái" },
  ];

  const filters = [
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Ngừng hoạt động" },
  ];

  const handleToggleStatus = (id, activate) => {
    if (readOnly) return;
    setHalls((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, status: activate ? "active" : "inactive" } : h
      )
    );
  };

  return (
    <>
      {creating ? (
        readOnly ? (
          <div className="alert alert-secondary text-center mt-3">
            Chế độ chỉ xem: không thể tạo mới sảnh.
          </div>
        ) : (
          <HallCreate onBack={() => setCreating(false)} />
        )
      ) : activeHall ? (
        <HallProfile hall={activeHall} onBack={() => setActiveHall(null)} readOnly={readOnly} />
      ) : (
        <CrudSection
          title="Sảnh tiệc"
          columns={columns}
          data={halls}
          filters={filters}
          onToggleStatus={handleToggleStatus}
          onRowClick={(row) => setActiveHall(row)}
          onCreate={() => !readOnly && setCreating(true)}
          readOnly={readOnly} // 🟢 THÊM DÒNG NÀY
        />
      )}
    </>
  );
}
