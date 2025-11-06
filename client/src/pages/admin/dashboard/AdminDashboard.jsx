import { useState } from "react";
import RevenueAnalytics from "./RevenueAnalytics";
import BookingAnalytics from "./BookingAnalytics";
import PartnerPerformanceAnalytics from "./PartnerPerformanceAnalytics";
import CustomerInsightAnalytics from "./CustomerInsightAnalytics";
import SystemSettings from "./SystemSettings";
import Logs from "./Logs";
import AdminLayout from "../../../layouts/AdminLayout";

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState("revenue");

  const tabs = [
    { key: "revenue", label: "Doanh Thu" },
    { key: "booking", label: "Đặt Chỗ" },
    { key: "partner", label: "Hiệu Suất Đối Tác" },
    { key: "customer", label: "Phân Tích Khách Hàng" },
    { key: "system", label: "Cài Đặt Hệ Thống" },
    { key: "logs", label: "Nhật Ký Hệ Thống" },
  ];

  return (
    <AdminLayout>
      <div
        style={{
          padding: "24px",
          backgroundColor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            borderBottom: "2px solid #e5e7eb",
            paddingBottom: "12px",
            marginBottom: "24px",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCurrentView(tab.key)}
              style={{
                background: "none",
                border: "none",
                padding: "8px 16px",
                fontSize: "0.875rem",
                fontWeight: "600",
                color:
                  currentView === tab.key ? "#8b5cf6" : "#6b7280",
                borderBottom:
                  currentView === tab.key
                    ? "2px solid #8b5cf6"
                    : "none",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {currentView === "revenue" && <RevenueAnalytics />}
        {currentView === "booking" && <BookingAnalytics />}
        {currentView === "partner" && <PartnerPerformanceAnalytics />}
        {currentView === "customer" && <CustomerInsightAnalytics />}
        {currentView === "system" && <SystemSettings />}
        {currentView === "logs" && <Logs />}
      </div>
    </AdminLayout>
  );
}
