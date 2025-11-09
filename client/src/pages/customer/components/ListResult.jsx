import React, { useState } from "react";
import ProductCard from "./ProductCard";
import {
  Funnel,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";

const ListResult = ({
  venues = [],
  sortBy,
  onSortChange,
  currentPage,
  onPageChange,
  itemsPerPage,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const totalPages = Math.ceil(venues.length / itemsPerPage);
  const paginatedVenues = venues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const query = new URLSearchParams(useLocation().search);
  const location = query.get("location") || "Địa điểm";

  const sortOptions = [
    { value: "recommended", label: "Độ phổ biến" },
    { value: "price-low", label: "Giá thấp nhất" },
    { value: "price-high", label: "Giá cao nhất" },
    { value: "rating", label: "Điểm đánh giá" },
  ];

  const currentOption =
    sortOptions.find((opt) => opt.value === sortBy) || sortOptions[0];

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: "2px solid #f1f1f1",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
            {location}
          </h2>
          <p style={{ fontSize: 16, color: "#555" }}>
            {venues.length} nơi lưu trú được tìm thấy
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Funnel size={18} color="#6B7280" />
          <span style={{ fontSize: 14, color: "#6B7280", fontWeight: 500 }}>
            Sắp xếp theo:
          </span>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                padding: "10px 16px",
                border: "2px solid #E11D48",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                background: "#fff",
                color: "#E11D48",
                minWidth: 200,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFF1F2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{currentOption.label}</span>
              </div>
              <ChevronDown
                size={14}
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                  }}
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: "#fff",
                    border: "2px solid #E5E7EB",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    minWidth: 200,
                    zIndex: 1000,
                    overflow: "hidden",
                  }}
                >
                  {sortOptions.map((opt) => {
                    const OptionIcon = opt.Icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          onSortChange(opt.value);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "none",
                          background: sortBy === opt.value ? "#FFF1F2" : "#fff",
                          color: sortBy === opt.value ? "#E11D48" : "#374151",
                          fontSize: 14,
                          fontWeight: sortBy === opt.value ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          if (sortBy !== opt.value) {
                            e.currentTarget.style.background = "#F9FAFB";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (sortBy !== opt.value) {
                            e.currentTarget.style.background = "#fff";
                          }
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div>
        {paginatedVenues.map((v) => (
          <ProductCard key={v.id} venue={v} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            marginTop: 40,
          }}
        >
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "10px 18px",
              border: `2px solid ${currentPage === 1 ? "#E5E7EB" : "#E11D48"}`,
              borderRadius: 8,
              backgroundColor: "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: currentPage === 1 ? "#9CA3AF" : "#E11D48",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.target.style.background = "#E11D48";
                e.target.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.background = "#fff";
                e.target.style.color = "#E11D48";
              }
            }}
          >
            <ChevronLeft size={16} />
            Trước
          </button>

          <div
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#E11D48", fontSize: 16 }}>
              Trang {currentPage}
            </span>
            <span style={{ color: "#D1D5DB" }}>/</span>
            <span style={{ color: "#6B7280" }}>{totalPages}</span>
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "10px 18px",
              border: `2px solid ${
                currentPage === totalPages ? "#E5E7EB" : "#E11D48"
              }`,
              borderRadius: 8,
              backgroundColor: "#fff",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: currentPage === totalPages ? "#9CA3AF" : "#E11D48",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.background = "#E11D48";
                e.target.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.background = "#fff";
                e.target.style.color = "#E11D48";
              }
            }}
          >
            Sau
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ListResult;
