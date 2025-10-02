"use client"

import { useState } from "react"
import { Card, Row, Col, Table, Badge, ButtonGroup, Button } from "react-bootstrap"
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  Area,
  ComposedChart,
  RadialBarChart,
  RadialBar,
} from "recharts"
import PartnerLayout from "../../layouts/PartnerLayout"
const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState("month")

  const stats = {
    totalRevenue: 500000000,
    pendingBookings: 5,
    confirmedBookings: 12,
    completedBookings: 28,
    averageRating: 4.8,
    totalCustomers: 156,
  }

  const bookings = [
    {
      id: 101,
      customerName: "Trần Thị B",
      eventDate: "15/12/2023",
      guests: 200,
      status: "confirmed",
      total: 130000000,
    },
    {
      id: 102,
      customerName: "Lê Văn C",
      eventDate: "20/12/2023",
      guests: 150,
      status: "pending",
      total: 150000000,
    },
    {
      id: 103,
      customerName: "Hoàng Văn E",
      eventDate: "25/12/2023",
      guests: 180,
      status: "completed",
      total: 130000000,
    },
  ]

  const getRevenueData = () => {
    if (timePeriod === "week") {
      return [
        { period: "T2", revenue: 45000000, bookings: 2 },
        { period: "T3", revenue: 52000000, bookings: 3 },
        { period: "T4", revenue: 38000000, bookings: 1 },
        { period: "T5", revenue: 65000000, bookings: 4 },
        { period: "T6", revenue: 78000000, bookings: 5 },
        { period: "T7", revenue: 95000000, bookings: 6 },
        { period: "CN", revenue: 88000000, bookings: 5 },
      ]
    } else if (timePeriod === "quarter") {
      return [
        { period: "Q1", revenue: 830000000, bookings: 45 },
        { period: "Q2", revenue: 1200000000, bookings: 62 },
        { period: "Q3", revenue: 980000000, bookings: 51 },
        { period: "Q4", revenue: 1450000000, bookings: 73 },
      ]
    } else if (timePeriod === "year") {
      return [
        { period: "2020", revenue: 2800000000, bookings: 145 },
        { period: "2021", revenue: 3200000000, bookings: 168 },
        { period: "2022", revenue: 3850000000, bookings: 195 },
        { period: "2023", revenue: 4460000000, bookings: 231 },
      ]
    }
    // Default: month
    return [
      { period: "T1", revenue: 200000000, bookings: 12 },
      { period: "T2", revenue: 350000000, bookings: 18 },
      { period: "T3", revenue: 280000000, bookings: 15 },
      { period: "T4", revenue: 400000000, bookings: 22 },
      { period: "T5", revenue: 500000000, bookings: 28 },
      { period: "T6", revenue: 300000000, bookings: 16 },
    ]
  }

  const bookingStatusData = [
    { name: "Chờ xác nhận", value: stats.pendingBookings, color: "#f59e0b" },
    { name: "Đã xác nhận", value: stats.confirmedBookings, color: "#8b5cf6" },
    { name: "Hoàn thành", value: stats.completedBookings, color: "#10b981" },
  ]

  const hallPerformanceData = [
    { hall: "Sảnh A", bookings: 35, revenue: 450000000, fill: "#c4b5fd" },
    { hall: "Sảnh B", bookings: 28, revenue: 380000000, fill: "#a78bfa" },
    { hall: "Sảnh C", bookings: 42, revenue: 520000000, fill: "#8b5cf6" },
    { hall: "Sảnh VIP", bookings: 18, revenue: 680000000, fill: "#7c3aed" },
  ]

  const satisfactionData = [
    { category: "Chất lượng món ăn", score: 4.9 },
    { category: "Dịch vụ", score: 4.7 },
    { category: "Không gian", score: 4.8 },
    { category: "Giá cả", score: 4.5 },
    { category: "Tổng thể", score: 4.8 },
  ]

  const statusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success"
      case "pending":
        return "warning"
      case "completed":
        return "primary"
      default:
        return "secondary"
    }
  }

  return (
    <PartnerLayout>
    <div style={{ minHeight: "100vh" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ marginBottom: "8px", color: "#1f2937", fontWeight: "600" }}>Tổng Quan Dashboard</h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>Theo dõi hiệu suất kinh doanh của nhà hàng</p>
      </div>

      <Row className="mb-4" style={{ gap: "0" }}>
        <Col md={3} className="mb-3">
          <Card
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              background: "white",
            }}
          >
            <Card.Body>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "8px" }}>Doanh thu tháng</div>
              <div style={{ fontSize: "1.75rem", fontWeight: "600", color: "#8b5cf6" }}>
                {(stats.totalRevenue.toLocaleString())} ₫
              </div>
              <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "8px" }}>↑ 12% so với tháng trước</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              background: "white",
            }}
          >
            <Card.Body>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "8px" }}>Tổng đơn đặt</div>
              <div style={{ fontSize: "1.75rem", fontWeight: "600", color: "#8b5cf6" }}>
                {stats.pendingBookings + stats.confirmedBookings + stats.completedBookings}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "8px" }}>↑ 8% so với tháng trước</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              background: "white",
            }}
          >
            <Card.Body>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "8px" }}>Đánh giá trung bình</div>
              <div style={{ fontSize: "1.75rem", fontWeight: "600", color: "#8b5cf6" }}>{stats.averageRating} ⭐</div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "8px" }}>
                Từ {stats.totalCustomers} đánh giá
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              background: "white",
            }}
          >
            <Card.Body>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "8px" }}>Chờ xác nhận</div>
              <div style={{ fontSize: "1.75rem", fontWeight: "600", color: "#f59e0b" }}>{stats.pendingBookings}</div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "8px" }}>Cần xử lý ngay</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0, color: "#1f2937", fontWeight: "600" }}>Phân tích doanh thu</h4>
        <ButtonGroup>
          <Button
            variant={timePeriod === "week" ? "primary" : "outline-secondary"}
            onClick={() => setTimePeriod("week")}
            style={{
              fontSize: "0.875rem",
              backgroundColor: timePeriod === "week" ? "#8b5cf6" : "transparent",
              borderColor: "#d1d5db",
              color: timePeriod === "week" ? "white" : "#6b7280",
            }}
          >
            Tuần
          </Button>
          <Button
            variant={timePeriod === "month" ? "primary" : "outline-secondary"}
            onClick={() => setTimePeriod("month")}
            style={{
              fontSize: "0.875rem",
              backgroundColor: timePeriod === "month" ? "#8b5cf6" : "transparent",
              borderColor: "#d1d5db",
              color: timePeriod === "month" ? "white" : "#6b7280",
            }}
          >
            Tháng
          </Button>
          <Button
            variant={timePeriod === "quarter" ? "primary" : "outline-secondary"}
            onClick={() => setTimePeriod("quarter")}
            style={{
              fontSize: "0.875rem",
              backgroundColor: timePeriod === "quarter" ? "#8b5cf6" : "transparent",
              borderColor: "#d1d5db",
              color: timePeriod === "quarter" ? "white" : "#6b7280",
            }}
          >
            Quý
          </Button>
          <Button
            variant={timePeriod === "year" ? "primary" : "outline-secondary"}
            onClick={() => setTimePeriod("year")}
            style={{
              fontSize: "0.875rem",
              backgroundColor: timePeriod === "year" ? "#8b5cf6" : "transparent",
              borderColor: "#d1d5db",
              color: timePeriod === "year" ? "white" : "#6b7280",
            }}
          >
            Năm
          </Button>
        </ButtonGroup>
      </div>

      <Row className="mb-4">
        <Col md={8} className="mb-3">
          <Card style={{ border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <Card.Body>
              <Card.Title style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "20px", color: "#1f2937" }}>
                Doanh thu & Số lượng đơn
              </Card.Title>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={getRevenueData()}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" stroke="#9ca3af" style={{ fontSize: "0.6rem" }} />
                  <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: "0.6rem" }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: "0.8rem" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === "revenue") return [`${(value)} ₫`, "Doanh thu"]
                      return [value, "Số đơn"]
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    fill="url(#colorRevenue)"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Doanh thu"
                  />
                  <Bar yAxisId="right" dataKey="bookings" fill="#a78bfa" name="Số đơn" radius={[8, 8, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card style={{ border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <Card.Body>
              <Card.Title style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "20px", color: "#1f2937" }}>
                Phân bổ trạng thái đơn
              </Card.Title>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card style={{ border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Card.Body>
          <h4 style={{ marginBottom: "20px", color: "#1f2937", fontWeight: "600" }}>Đơn đặt tiệc gần đây</h4>
          <Table hover responsive style={{ marginBottom: 0 }}>
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th style={{ borderTop: "none", color: "#6b7280", fontWeight: "600", fontSize: "0.875rem" }}>Mã đơn</th>
                <th style={{ borderTop: "none", color: "#6b7280", fontWeight: "600", fontSize: "0.875rem" }}>
                  Khách hàng
                </th>
                <th style={{ borderTop: "none", color: "#6b7280", fontWeight: "600", fontSize: "0.875rem" }}>
                  Ngày tổ chức
                </th>
                <th style={{ borderTop: "none", color: "#6b7280", fontWeight: "600", fontSize: "0.875rem" }}>
                  Số khách
                </th>
                <th style={{ borderTop: "none", color: "#6b7280", fontWeight: "600", fontSize: "0.875rem" }}>
                  Tổng tiền
                </th>
                <th style={{ borderTop: "none", color: "#6b7280", fontWeight: "600", fontSize: "0.875rem" }}>
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ fontSize: "0.875rem" }}>
                  <td style={{ verticalAlign: "middle", fontWeight: "600", color: "#374151" }}>#{b.id}</td>
                  <td style={{ verticalAlign: "middle", color: "#374151" }}>{b.customerName}</td>
                  <td style={{ verticalAlign: "middle", color: "#374151" }}>{b.eventDate}</td>
                  <td style={{ verticalAlign: "middle", color: "#374151" }}>{b.guests}</td>
                  <td style={{ verticalAlign: "middle", fontWeight: "600", color: "#374151" }}>
                    {(b.total.toLocaleString())}₫
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <Badge
                      bg={statusVariant(b.status)}
                      style={{ padding: "6px 12px", fontSize: "0.75rem", fontWeight: "500" }}
                    >
                      {b.status === "confirmed"
                        ? "Đã xác nhận"
                        : b.status === "pending"
                          ? "Chờ xác nhận"
                          : "Đã hoàn thành"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
    </PartnerLayout>
  )
}

export default Dashboard;