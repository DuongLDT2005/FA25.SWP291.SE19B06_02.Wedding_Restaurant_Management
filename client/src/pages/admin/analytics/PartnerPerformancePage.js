import React, { useState, useMemo } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

// 📌 Mock partner performance data
const partners = ["Nhà hàng Hoa Sen", "Royal Palace", "Diamond Hall", "Paradise", "Sunshine", "Golden Lotus"];
const mockPartnerData = Array.from({ length: 120 }, (_, i) => {
  const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
  return partners.map((p, idx) => ({
    date,
    partnerId: idx + 1,
    partnerName: p,
    revenue: Math.floor(Math.random() * 20_000_000) + 3_000_000,
    bookings: Math.floor(Math.random() * 25) + 5,
  }));
}).flat();

// 👉 Hàm format số ngắn gọn (K / M)
const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString();
};

const PartnerPerformancePage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🧠 Lọc dữ liệu theo khoảng thời gian
  const filteredData = useMemo(() => {
    return mockPartnerData.filter((d) => {
      const date = dayjs(d.date);
      if (startDate && date.isBefore(dayjs(startDate))) return false;
      if (endDate && date.isAfter(dayjs(endDate))) return false;
      return true;
    });
  }, [startDate, endDate]);

  // 📊 Tóm tắt theo partner
  const partnerSummary = useMemo(() => {
    const summary = filteredData.reduce((acc, d) => {
      if (!acc[d.partnerId]) {
        acc[d.partnerId] = {
          partnerId: d.partnerId,
          partnerName: d.partnerName,
          totalRevenue: 0,
          totalBookings: 0,
        };
      }
      acc[d.partnerId].totalRevenue += d.revenue;
      acc[d.partnerId].totalBookings += d.bookings;
      return acc;
    }, {});
    return Object.values(summary);
  }, [filteredData]);

  const totalRevenue = partnerSummary.reduce((sum, p) => sum + p.totalRevenue, 0);
  const totalBookings = partnerSummary.reduce((sum, p) => sum + p.totalBookings, 0);

  // 🏆 Top 5 đối tác theo doanh thu
  const topPartners = [...partnerSummary]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  return (
    <div>
      <CRow className="mb-4">
        <CCol>
          <h4>🤝 Partner Performance</h4>
          <p style={{ color: "#666" }}>
            Thống kê doanh thu và số lượt booking theo đối tác
          </p>
        </CCol>
      </CRow>

      {/* Bộ lọc thời gian */}
      <CCard className="mb-4">
        <CCardHeader>Bộ lọc thời gian</CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <CFormInput
                type="date"
                label="Từ ngày"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CCol>
            <CCol md={3}>
              <CFormInput
                type="date"
                label="Đến ngày"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </CCol>
            <CCol md={3}>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Reset bộ lọc
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Tổng quan */}
      <CCard className="mb-4">
        <CCardBody>
          <h5>
            Tổng doanh thu: {totalRevenue.toLocaleString()} VND | Tổng bookings: {totalBookings}
          </h5>
          <p style={{ color: "#666" }}>
            Tổng số đối tác được thống kê: {partnerSummary.length}
          </p>
        </CCardBody>
      </CCard>

      {/* Biểu đồ hiệu suất */}
      <CCard className="mb-4">
        <CCardHeader>Biểu đồ hiệu suất đối tác</CCardHeader>
        <CCardBody>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={partnerSummary}
              margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="partnerName"
                interval={0}
                angle={-20}
                textAnchor="end"
                height={80}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={formatNumber}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
              />
              <Tooltip
                formatter={(val) => val.toLocaleString()}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="totalRevenue"
                name="Doanh thu (VND)"
                fill="#8884d8"
              />
              <Bar
                yAxisId="right"
                dataKey="totalBookings"
                name="Bookings"
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        </CCardBody>
      </CCard>

      {/* 🏆 Bảng xếp hạng top đối tác */}
      <CCard>
        <CCardHeader>🏆 Top 5 đối tác theo doanh thu</CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tên đối tác</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tổng doanh thu</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tổng bookings</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {topPartners.map((p, index) => (
                <CTableRow key={p.partnerId}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{p.partnerName}</CTableDataCell>
                  <CTableDataCell>{p.totalRevenue.toLocaleString()} VND</CTableDataCell>
                  <CTableDataCell>{p.totalBookings}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default PartnerPerformancePage;
