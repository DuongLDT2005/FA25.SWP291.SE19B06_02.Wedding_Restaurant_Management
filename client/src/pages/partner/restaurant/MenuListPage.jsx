import React, { useState } from "react";
import CrudSection from "../../../layouts/CrudSection";
import MenuDetailPage from "./MenuDetailPage";
import MenuCreatePage from "./MenuCreatePage";
import mock from "../../../mock/partnerMock";

export default function MenuListPage() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [creating, setCreating] = useState(false);

  const [menus, setMenus] = useState(
    mock.menu.map((m) => ({
      id: m.menuID,
      name: m.name,
      price: m.price.toLocaleString("vi-VN") + " ₫",
      status: m.status === 1 ? "active" : "inactive",
    }))
  );

  const columns = [
    { key: "name", label: "Tên thực đơn" },
    { key: "price", label: "Giá / bàn" },
    { key: "status", label: "Trạng thái" },
  ];

  const filters = [
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Ngừng hoạt động" },
  ];

  const handleToggleStatus = (id, activate) => {
    setMenus((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: activate ? "active" : "inactive" } : m
      )
    );
  };

  return (
    <>
      {creating ? (
        <MenuCreatePage onBack={() => setCreating(false)} />
      ) : activeMenu ? (
        <MenuDetailPage menu={activeMenu} onBack={() => setActiveMenu(null)} />
      ) : (
        <CrudSection
          title="Menu"
          columns={columns}
          data={menus}
          filters={filters}
          onRowClick={(row) => {
            const fullMenu = mock.menu.find((m) => m.menuID === row.id);
            setActiveMenu(fullMenu);
          }}
          onToggleStatus={handleToggleStatus} 
          onCreate={() => setCreating(true)}
        />
      )}
    </>
  );
}