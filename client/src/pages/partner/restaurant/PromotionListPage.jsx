import React, { useState } from "react";
import CrudSection from "../../../layouts/CrudSection";
import PromotionDetailPage from "./PromotionDetailPage";
import PromotionCreatePage from "./PromotionCreatePage.jsx";
import mock from "../../../mock/partnerMock"; // file mock data

export default function PromotionListPage() {
  const [activePromotion, setActivePromotion] = useState(null);
  const [creating, setCreating] = useState(false);

  const [promotions, setPromotions] = useState(
    mock.promotions.map((p) => ({
      id: p.promotionID,
      name: p.name,
      description: p.description,
      minTable: p.minTable,
      discount:
        p.discountType === 0
          ? `${p.discountValue}%`
          : "Miễn phí dịch vụ",
      date: `${p.startDate} - ${p.endDate}`,
      status: p.status === 1 ? "active" : "inactive",
    }))
  );

  const columns = [
    { key: "name", label: "Tên khuyến mãi" },
    { key: "minTable", label: "Số bàn tối thiểu" },
    { key: "discount", label: "Giảm giá" },
    { key: "date", label: "Thời gian áp dụng" },
    { key: "status", label: "Trạng thái" },
  ];

  const filters = [
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Ngừng hoạt động" },
  ];

  const handleToggleStatus = (id, activate) => {
    setPromotions((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: activate ? "active" : "inactive" } : p
      )
    );
  };

  return (
    <>
      {creating ? (
        <PromotionCreatePage onBack={() => setCreating(false)} />
      ) : activePromotion ? (
        <PromotionDetailPage
          promotion={activePromotion}
          onBack={() => setActivePromotion(null)}
        />
      ) : (
        <CrudSection
          title="Khuyến mãi"
          columns={columns}
          data={promotions}
          filters={filters}
          onRowClick={(row) => {
            const full = mock.promotions.find((p) => p.promotionID === row.id);
            setActivePromotion(full);
          }}
          onToggleStatus={handleToggleStatus}
          onCreate={() => setCreating(true)}
        />
      )}
    </>
  );
}