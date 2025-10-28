import { useState } from "react"
import SystemOverview from "./SystemOverview"
import RestaurantComparison from "./RestaurantComparison"
import RestaurantDetail from "./RestaurantDetailStats"
import DeepInsights from "./DeepInsights"
import PartnerLayout from "../../../layouts/PartnerLayout"

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState("system")
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [insightsType, setInsightsType] = useState("")
  const [insightsId, setInsightsId] = useState("")

  const handleSelectRestaurant = (restaurantId) => {
    setSelectedRestaurant(restaurantId)
    setCurrentView("detail")
  }

  const handleDrillDown = (type, id) => {
    setInsightsType(type)
    setInsightsId(id)
    setCurrentView("insights")
  }

  const handleBackToComparison = () => {
    setCurrentView("comparison")
    setSelectedRestaurant(null)
  }

  const handleBackToDetail = () => {
    setCurrentView("detail")
  }

  return (
    <PartnerLayout style={{ padding: "24px", backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <div
        style={{
          marginBottom: "32px",
          display: "flex",
          gap: "16px",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "16px",
        }}
      >
        <button
          onClick={() => setCurrentView("system")}
          style={{
            background: "none",
            border: "none",
            padding: "8px 16px",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: currentView === "system" ? "#8b5cf6" : "#6b7280",
            borderBottom: currentView === "system" ? "2px solid #8b5cf6" : "none",
            cursor: "pointer",
            marginBottom: "-18px",
          }}
        >
          Tổng Quan Hệ Thống
        </button>
        <button
          onClick={() => setCurrentView("comparison")}
          style={{
            background: "none",
            border: "none",
            padding: "8px 16px",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: currentView === "comparison" ? "#8b5cf6" : "#6b7280",
            borderBottom: currentView === "comparison" ? "2px solid #8b5cf6" : "none",
            cursor: "pointer",
            marginBottom: "-18px",
          }}
        >
          So Sánh Nhà Hàng
        </button>
        {selectedRestaurant && (
          <button
            onClick={() => setCurrentView("detail")}
            style={{
              background: "none",
              border: "none",
              padding: "8px 16px",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: currentView === "detail" ? "#8b5cf6" : "#6b7280",
              borderBottom: currentView === "detail" ? "2px solid #8b5cf6" : "none",
              cursor: "pointer",
              marginBottom: "-18px",
            }}
          >
            Chi Tiết Nhà Hàng
          </button>
        )}
        {currentView === "insights" && (
          <button
            style={{
              background: "none",
              border: "none",
              padding: "8px 16px",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#8b5cf6",
              borderBottom: "2px solid #8b5cf6",
              cursor: "pointer",
              marginBottom: "-18px",
            }}
          >
            Phân Tích Chuyên Sâu
          </button>
        )}
      </div>

      {currentView === "system" && <SystemOverview />}

      {currentView === "comparison" && <RestaurantComparison onSelectRestaurant={handleSelectRestaurant} />}

      {currentView === "detail" && selectedRestaurant && (
        <RestaurantDetail
          restaurantId={selectedRestaurant}
          onBack={handleBackToComparison}
          onDrillDown={handleDrillDown}
        />
      )}

      {currentView === "insights" && <DeepInsights type={insightsType} id={insightsId} onBack={handleBackToDetail} />}
    </PartnerLayout>
  )
}