import { useState } from "react"
import { Row, Col, Card } from "react-bootstrap"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts"
import KPICard from "../../partner/dashboard/KPICard"
import TimePeriodSelector from "../../partner/dashboard/TimePeriodSelector"
import { formatCompactCurrency } from "../../../utils/formatCurrency"

export default function RevenueAnalytics() {
    const [timePeriod, setTimePeriod] = useState("month")

    // 📊 Dữ liệu tổng hợp
    const stats = {
        totalRevenue: 12800000000,
        growthRate: 12.4,
        avgRevenuePerBooking: 25300000,
        cancellationRate: 4.5,
    }

    // 📅 Doanh thu theo thời gian
    const getRevenueData = () => {
        switch (timePeriod) {
            case "week":
                return [
                    { period: "T2", revenue: 480000000 },
                    { period: "T3", revenue: 520000000 },
                    { period: "T4", revenue: 560000000 },
                    { period: "T5", revenue: 610000000 },
                    { period: "T6", revenue: 680000000 },
                    { period: "T7", revenue: 720000000 },
                    { period: "CN", revenue: 690000000 },
                ]
            case "quarter":
                return [
                    { period: "Q1", revenue: 9200000000 },
                    { period: "Q2", revenue: 10400000000 },
                    { period: "Q3", revenue: 9800000000 },
                    { period: "Q4", revenue: 11200000000 },
                ]
            case "year":
                return [
                    { period: "2020", revenue: 38500000000 },
                    { period: "2021", revenue: 41200000000 },
                    { period: "2022", revenue: 44600000000 },
                    { period: "2023", revenue: 48000000000 },
                ]
            default:
                return [
                    { period: "T1", revenue: 3200000000 },
                    { period: "T2", revenue: 3500000000 },
                    { period: "T3", revenue: 3700000000 },
                    { period: "T4", revenue: 4200000000 },
                    { period: "T5", revenue: 4650000000 },
                    { period: "T6", revenue: 4900000000 },
                ]
        }
    }

    // 🏢 Doanh thu theo nhà hàng
    const revenueByRestaurant = [
        { restaurant: "The Rose Hall", revenue: 4800000000, bookings: 188 },
        { restaurant: "Golden Lotus", revenue: 3900000000, bookings: 162 },
        { restaurant: "Diamond Palace", revenue: 3500000000, bookings: 145 },
        { restaurant: "Royal Garden", revenue: 2800000000, bookings: 118 },
    ]

    // 🍰 Phân phối doanh thu theo tỉ lệ %
    const distributionData = [
        { name: "The Rose Hall", value: 29.4, color: "#8b5cf6" },
        { name: "Golden Lotus", value: 23.8, color: "#a78bfa" },
        { name: "Diamond Palace", value: 21.5, color: "#c4b5fd" },
        { name: "Royal Garden", value: 19.3, color: "#ddd6fe" },
    ]

    return (
        <div>
            <Row className="mb-4">
                <Col>
                    <h2 style={{ fontWeight: 600, color: "#1f2937" }}>💰 Phân tích Doanh thu</h2>
                    <p className="text-muted mb-0">
                        Tổng hợp & so sánh doanh thu hệ thống theo thời gian và nhà hàng
                    </p>
                </Col>
                <Col xs="auto" className="text-end">
                    <p className="text-muted fst-italic mb-0">
                        Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
                    </p>
                </Col>
            </Row>

            {/* KPI Cards */}
            <Row className="mb-4">
                <Col md={3}>
                    <KPICard title="Tổng doanh thu" value={formatCompactCurrency(stats.totalRevenue)} subtitle="Toàn hệ thống" />
                </Col>
                <Col md={3}>
                    <KPICard title="Tăng trưởng doanh thu" value={`${stats.growthRate}%`} trend="↑ So với kỳ trước" trendColor="#10b981" />
                </Col>
                <Col md={3}>
                    <KPICard title="Doanh thu/Booking TB" value={formatCompactCurrency(stats.avgRevenuePerBooking)} subtitle="Trung bình mỗi đơn" />
                </Col>
                <Col md={3}>
                    <KPICard title="Tỷ lệ hủy" value={`${stats.cancellationRate}%`} trend="↓ So với kỳ trước" trendColor="#10b981" />
                </Col>
            </Row>

            {/* Doanh thu theo thời gian */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                }}
            >
                <h4 style={{ fontWeight: 600, color: "#1f2937" }}>Doanh thu theo thời gian</h4>
                <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />
            </div>

            <Card className="mb-4" style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <Card.Body>
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={getRevenueData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="period" stroke="#9ca3af" />
                            <YAxis tickFormatter={formatCompactCurrency} stroke="#9ca3af" />
                            <Tooltip
                                formatter={(value) => [formatCompactCurrency(value), "Doanh thu"]}
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>

            {/* So sánh doanh thu giữa các nhà hàng */}
            <h4 style={{ fontWeight: 600, color: "#1f2937", marginBottom: "16px" }}>
                So sánh doanh thu giữa các nhà hàng
            </h4>
            <Row>
                <Col md={8}>
                    <Card className="mb-4" style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={revenueByRestaurant}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="restaurant" stroke="#9ca3af" />
                                    <YAxis yAxisId="left" tickFormatter={formatCompactCurrency} />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip
                                        formatter={(value, name) =>
                                            name === "Doanh thu"
                                                ? [formatCompactCurrency(value), "Doanh thu"]
                                                : [value, "Số booking"]
                                        }
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "1px solid #e5e7eb",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                        }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="revenue" fill="#8b5cf6" name="Doanh thu" radius={[8, 8, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="bookings" fill="#c4b5fd" name="Booking" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Biểu đồ tròn tỉ lệ doanh thu */}
                <Col md={4}>
                    <Card className="mb-4" style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={distributionData}
                                        dataKey="value"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        labelLine={false}
                                    >
                                        {distributionData.map((d, i) => (
                                            <Cell key={i} fill={d.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v) => `${v}%`} />
                                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
