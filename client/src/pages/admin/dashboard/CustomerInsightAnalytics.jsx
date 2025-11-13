import { useState, useEffect } from "react";
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
import KPICard from "../../partner/dashboard/KPICard";
import exportToExcel from "../../../utils/exportToExcel";

export default function CustomerInsightAnalytics() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newThisMonth: 0,
    repeatedRate: 0,
    avgBookingPerCustomer: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/dashboard/customers")
      .then((res) => {
        const customersByMonth = res.data.customersByMonth || [];
        const repeatedRate = res.data.repeatedRate || 0;
        const avgBookingPerCustomer = res.data.avgBookingPerCustomer || 0;

        setData(customersByMonth);

        // Tính KPI
        const totalCustomers = res.data.totalCustomers || 0;
        const newThisMonth =
          customersByMonth.length > 0
            ? customersByMonth[customersByMonth.length - 1].customers
            : 0;

        setStats({
          totalCustomers,
          newThisMonth,
          repeatedRate,
          avgBookingPerCustomer,
        });
      })
      .catch((err) => {
        console.error("Error loading customer insights:", err);
        setError("Không thể tải dữ liệu khách hàng.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>⏳ Đang tải phân tích khách hàng...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!data.length) return <p>Không có dữ liệu khách hàng.</p>;

  return (
    <div>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 style={{ fontWeight: 600, color: "#1f2937" }}>
            👥 Phân tích khách hàng
          </h2>
          <p className="text-muted mb-0">
            Theo dõi tăng trưởng người dùng & hành vi đặt tiệc
          </p>
        </Col>

        {/* Xuất Excel */}
        <Col xs="auto" className="text-end">
          <button
            onClick={() => exportToExcel(data, "CustomerInsights")}
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
            title="Tổng số khách hàng"
            value={stats.totalCustomers}
            subtitle="Khách đã đăng ký"
          />
        </Col>

        <Col md={3}>
          <KPICard
            title="Khách mới tháng này"
            value={stats.newThisMonth}
            subtitle="Người dùng mới"
          />
        </Col>

        <Col md={3}>
          <KPICard
            title="Tỷ lệ khách quay lại"
            value={`${stats.repeatedRate}%`}
            trend="Dựa trên số booking"
            trendColor="#8b5cf6"
          />
        </Col>

        <Col md={3}>
          <KPICard
            title="Booking TB / khách"
            value={stats.avgBookingPerCustomer}
            subtitle="Mỗi người dùng"
          />
        </Col>
      </Row>

      {/* Biểu đồ số khách theo tháng */}
      <Card className="mb-4" style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <Card.Body>
          <h4 style={{ fontWeight: 600, color: "#1f2937", marginBottom: "16px" }}>
            Số khách đăng ký theo tháng
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
                dataKey="customers"
                name="Số khách"
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
