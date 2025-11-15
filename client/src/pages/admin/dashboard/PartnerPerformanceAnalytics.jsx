import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Table } from "react-bootstrap";
import exportToExcel from "../../../utils/exportToExcel";
import KPICard from "../../partner/dashboard/KPICard";
import { formatCompactCurrency } from "../../../utils/formatCurrency";

export default function PartnerPerformanceAnalytics() {
  const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPartners: 0,
    avgRevenue: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/dashboard/partners")
      .then((res) => {
        const data = (res.data.partners || []).map((p) => ({
          ...p,
          revenue: Number(p.revenue) || 0,
          bookings: Number(p.bookings) || 0,
          rating: Number(p.rating) || 0, // ✅ ép kiểu số để tránh lỗi .toFixed()
        }));

        // 🧮 Tính KPI
        const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0);
        const totalPartners = data.length;
        const avgRevenue = totalPartners > 0 ? totalRevenue / totalPartners : 0;
        const avgRating =
          totalPartners > 0
            ? data.reduce((sum, p) => sum + p.rating, 0) / totalPartners
            : 0;

        setStats({
          totalRevenue,
          totalPartners,
          avgRevenue,
          avgRating: avgRating.toFixed(2),
        });

        setPartners(data);
      })
      .catch((err) => {
        console.error("Error loading partner performance:", err);
        setError("Không thể tải dữ liệu đối tác.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>⏳ Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!partners.length) return <p>Không có dữ liệu đối tác.</p>;

  return (
    <div>
      {/* ===== Header ===== */}
      <Row className="mb-4">
        <Col>
          <h2 style={{ fontWeight: 600, color: "#1f2937" }}>
            🤝 Hiệu suất đối tác
          </h2>
          <p className="text-muted mb-0">
            Phân tích doanh thu, lượt đặt và đánh giá trung bình của từng nhà hàng
          </p>
        </Col>

        {/* ✅ Nút Xuất Excel */}
        <Col xs="auto" className="text-end">
          <button
            onClick={() => exportToExcel(partners, "PartnerPerformance")}
            className="btn btn-outline-success btn-sm"
          >
            📤 Xuất Excel
          </button>
          <p className="text-muted fst-italic mb-0 mt-1">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </p>
        </Col>
      </Row>

      {/* ===== KPI Cards ===== */}
      <Row className="mb-4">
        <Col md={3}>
          <KPICard
            title="Tổng doanh thu hệ thống"
            value={formatCompactCurrency(stats.totalRevenue)}
            subtitle="Tất cả nhà hàng hoạt động"
          />
        </Col>
        <Col md={3}>
          <KPICard
            title="Số đối tác hoạt động"
            value={stats.totalPartners}
            subtitle="Nhà hàng đang hoạt động"
          />
        </Col>
        <Col md={3}>
          <KPICard
            title="Doanh thu trung bình"
            value={formatCompactCurrency(stats.avgRevenue)}
            subtitle="Mỗi nhà hàng"
          />
        </Col>
        <Col md={3}>
          <KPICard
            title="Đánh giá trung bình"
            value={`${stats.avgRating} ⭐`}
            subtitle="Từ khách hàng"
          />
        </Col>
      </Row>

      {/* ===== Bảng hiệu suất đối tác ===== */}
      <Card style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <Card.Body>
          <h4 style={{ fontWeight: 600, color: "#1f2937", marginBottom: "16px" }}>
            Hiệu suất từng đối tác
          </h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Nhà hàng</th>
                <th>Doanh thu (VNĐ)</th>
                <th>Số booking</th>
                <th>Đánh giá TB</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p, i) => (
                <tr key={p.restaurantID || i}>
                  <td>{i + 1}</td>
                  <td>{p.name || "—"}</td>
                  <td>{p.revenue.toLocaleString("vi-VN")}</td>
                  <td>{p.bookings}</td>
                  <td>
                    {p.rating ? (
                      <span style={{ color: "#facc15", fontWeight: 600 }}>
                        {p.rating.toFixed(1)} ⭐
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
