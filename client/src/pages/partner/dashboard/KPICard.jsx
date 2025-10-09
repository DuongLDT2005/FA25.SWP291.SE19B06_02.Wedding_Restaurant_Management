import { Card } from "react-bootstrap"

export default function KPICard({ title, value, subtitle, trend, trendColor = "#10b981" }) {
  return (
    <Card
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        background: "white",
        height: "100%",
      }}
    >
      <Card.Body>
        <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "8px" }}>{title}</div>
        <div style={{ fontSize: "1.75rem", fontWeight: "600", color: "#8b5cf6" }}>{value}</div>
        {trend && <div style={{ fontSize: "0.75rem", color: trendColor, marginTop: "8px" }}>{trend}</div>}
        {subtitle && !trend && (
          <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "8px" }}>{subtitle}</div>
        )}
      </Card.Body>
    </Card>
  )
}
