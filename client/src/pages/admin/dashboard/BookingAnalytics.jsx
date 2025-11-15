import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import exportToExcel from "../../../utils/exportToExcel";
import KPICard from "../../partner/dashboard/KPICard";

export default function BookingAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    avgPerMonth: 0,
    cancelRate: 0,
    growth: 0,
  });

  useEffect(() => {
    axios
      .get("/api/dashboard/bookings")
      .then((res) => {
        const bookings = res.data.bookingsByMonth.map((item) => ({
          month: item.month,
          bookings: parseInt(item.count, 10),
        }));

        // 📊 Tính toán KPI
        const total = bookings.reduce((sum, b) => sum + b.bookings, 0);
        const avgPerMonth =
          bookings.length > 0 ? total / bookings.length : 0;
        const cancelRate = res.data.cancelRate || 0;
        const growth =
          bookings.length > 1
            ? ((bookings[bookings.length - 1].bookings -
                bookings[bookings.length - 2].bookings) /
                bookings[bookings.length - 2].bookings) *
              100
            : 0;

        setStats({
          total,
          avgPerMonth: avgPerMonth.toFixed(1),
          cancelRate: cancelRate.toFixed(1),
          growth: growth.toFixed(1),
        });
        setData(bookings);
      })
      .catch((err) => {
        console.error("Error loading booking analytics:", err);
        setError("Không thể tải dữ liệu booking.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>⏳ Đang tải dữ liệu booking...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!data.length) return <p>Không có dữ liệu booking.</p>;

  return (
    <div>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 style={{ fontWeight: 600, color: "#1f2937" }}>📅 Phân tích Đặt chỗ</h2>
          <p className="text-muted mb-0">
            Thống kê và theo dõi xu hướng đặt tiệc theo thời gian
          </p>
        </Col>

        {/* ✅ Xuất Excel */}
        <Col xs="auto" className="text-end">
          <button
            onClick={() => exportToExcel(data, "BookingAnalytics")}
            className="btn btn-outline-success btn-sm"
          >
            📤 Xuất Excel
          </button>
          <p className="text-muted fst-italic mb-0 mt-1">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </p>
        </Col>
      </Row>

      {/* KPI Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <KPICard
            title="Tổng số booking"
            value={stats.total}
            subtitle="Tổng trong hệ thống"
          />
        </Col>
        <Col md={3}>
          <KPICard
            title="Booking TB / tháng"
            value={stats.avgPerMonth}
            subtitle="Trung bình mỗi tháng"
          />
        </Col>
        <Col md={3}>
          <KPICard
            title="Tăng trưởng"
            value={`${stats.growth}%`}
            trend={
              stats.growth >= 0 ? "↑ So với tháng trước" : "↓ So với tháng trước"
            }
            trendColor={stats.growth >= 0 ? "#10b981" : "#ef4444"}
          />
        </Col>
        <Col md={3}>
          <KPICard
            title="Tỷ lệ hủy"
            value={`${stats.cancelRate}%`}
            trend="Tỷ lệ booking bị hủy"
            trendColor="#ef4444"
          />
        </Col>
      </Row>

      {/* Chart */}
      <Card className="mb-4" style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <Card.Body>
          <h4 style={{ fontWeight: 600, color: "#1f2937", marginBottom: "16px" }}>
            Số lượng booking theo tháng
          </h4>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="bookings"
                name="Số lượng Booking"
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </div>
  );
}
