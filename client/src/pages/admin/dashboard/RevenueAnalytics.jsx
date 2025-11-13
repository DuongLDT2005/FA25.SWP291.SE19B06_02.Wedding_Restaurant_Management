import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import exportToExcel from "../../../utils/exportToExcel";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import KPICard from "../../partner/dashboard/KPICard";
import TimePeriodSelector from "../../partner/dashboard/TimePeriodSelector";
import { formatCompactCurrency } from "../../../utils/formatCurrency";

export default function RevenueAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/dashboard/revenue")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Error loading revenue analytics:", err);
        setError("Không thể tải dữ liệu doanh thu.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>⏳ Đang tải dữ liệu doanh thu...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!stats) return <p>Không có dữ liệu doanh thu.</p>;

  // 🧮 Xử lý dữ liệu trả về từ API
  const revenueData = stats.revenueByMonth.map((r) => ({
    period: r.month,
    revenue: Number(r.revenue),
  }));

  // 🏢 Doanh thu theo nhà hàng (nếu backend có)
  const revenueByRestaurant =
    stats.revenueByRestaurant?.map((r) => ({
      restaurant: r.restaurantID || `Nhà hàng #${r.restaurantID}`,
      revenue: Number(r.revenue),
      bookings: Number(r.payments || 0),
    })) || [];

  // 🍰 Dữ liệu biểu đồ tròn (phân phối doanh thu theo %)
  const totalRev = revenueByRestaurant.reduce((sum, r) => sum + r.revenue, 0);
  const distributionData = revenueByRestaurant.map((r) => ({
    name: r.restaurant,
    value: totalRev > 0 ? ((r.revenue / totalRev) * 100).toFixed(1) : 0,
  }));

  const pieColors = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"];

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 style={{ fontWeight: 600, color: "#1f2937" }}>
            💰 Phân tích Doanh thu
          </h2>
          <p className="text-muted mb-0">
            Tổng hợp & so sánh doanh thu hệ thống theo thời gian và nhà hàng
          </p>
        </Col>

        {/* ✅ Thêm nút Xuất Excel ở đây */}
        <Col xs="auto" className="text-end">
          <button
            onClick={() => {
              // Gộp dữ liệu muốn export
              const exportData = [
                { Title: "Tổng doanh thu", Value: stats.totalRevenue },
                { Title: "Tổng số booking", Value: stats.totalBookings },
                {
                  Title: "Doanh thu TB/Booking",
                  Value: stats.avgRevenuePerBooking,
                },
                { Title: "Tỷ lệ hủy (%)", Value: stats.cancellationRate },
                {},
                ...stats.revenueByMonth.map((r) => ({
                  Tháng: r.month,
                  "Doanh thu (VNĐ)": r.revenue,
                })),
              ];
              exportToExcel(exportData, "RevenueAnalytics");
            }}
            className="btn btn-outline-success btn-sm"
          >
            📤 Xuất Excel
          </button>

          <p className="text-muted fst-italic mb-0 mt-1">
            Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
          </p>
        </Col>
      </Row>

      {/* KPI Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <KPICard
            title="Tổng doanh thu"
            value={formatCompactCurrency(stats.totalRevenue)}
            subtitle="Toàn hệ thống"
          />
        </Col>
        <Col md={3}>
          <KPICard
            title="Tổng số booking"
            value={stats.totalBookings}
            subtitle="Tổng đơn tiệc"
          />
        </Col>
        <Col md={3}>
          <KPICard
            title="Doanh thu/Booking TB"
            value={formatCompactCurrency(stats.avgRevenuePerBooking)}
            subtitle="Trung bình mỗi đơn"
          />
        </Col>
        <Col md={3}>
          <KPICard
            title="Tỷ lệ hủy"
            value={`${stats.cancellationRate}%`}
            trendColor="#ef4444"
            trend="Booking bị hủy"
          />
        </Col>
      </Row>

      {/* Biểu đồ doanh thu theo thời gian */}
      <h4 style={{ fontWeight: 600, color: "#1f2937", marginBottom: "16px" }}>
        Doanh thu theo thời gian
      </h4>

      <Card
        className="mb-4"
        style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
      >
        <Card.Body>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" stroke="#9ca3af" />
              <YAxis tickFormatter={formatCompactCurrency} stroke="#9ca3af" />
              <Tooltip
                formatter={(v) => formatCompactCurrency(v)}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      {/* So sánh doanh thu giữa các nhà hàng */}
      {revenueByRestaurant.length > 0 && (
        <>
          <h4
            style={{ fontWeight: 600, color: "#1f2937", marginBottom: "16px" }}
          >
            So sánh doanh thu giữa các nhà hàng
          </h4>
          <Row>
            <Col md={8}>
              <Card
                className="mb-4"
                style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              >
                <Card.Body>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={revenueByRestaurant}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="restaurant" stroke="#9ca3af" />
                      <YAxis
                        yAxisId="left"
                        tickFormatter={formatCompactCurrency}
                      />
                      <Tooltip
                        formatter={(value, name) =>
                          name === "Doanh thu"
                            ? [formatCompactCurrency(value), "Doanh thu"]
                            : [value, "Booking"]
                        }
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="#8b5cf6"
                        name="Doanh thu"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="bookings"
                        fill="#c4b5fd"
                        name="Booking"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>

            {/* Biểu đồ tròn phân phối doanh thu */}
            <Col md={4}>
              <Card
                className="mb-4"
                style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              >
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
                        label={(entry) => `${entry.name}`}
                      >
                        {distributionData.map((entry, i) => (
                          <Cell
                            key={`cell-${i}`}
                            fill={pieColors[i % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
