import React, { useState, useMemo } from "react";
import { formatCompactCurrency, formatFullCurrency } from "../../../utils/formatter"; 
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
  CButton,
} from "@coreui/react";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import exportToExcel from "../../../utils/exportToExcel";

dayjs.extend(weekOfYear);

// 🧪 Mock data
const mockRevenue = Array.from({ length: 90 }, (_, i) => {
  const date = dayjs().subtract(i, "day");
  return {
    date: date.format("YYYY-MM-DD"),
    revenue: Math.floor(Math.random() * 20000000) + 2000000, // 2tr - 20tr
  };
}).reverse();

const RevenueAnalyticsPage = () => {
  const [viewMode, setViewMode] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 1️⃣ Lọc dữ liệu
  const filteredData = useMemo(() => {
    return mockRevenue.filter((d) => {
      const date = dayjs(d.date);
      if (startDate && date.isBefore(dayjs(startDate))) return false;
      if (endDate && date.isAfter(dayjs(endDate))) return false;
      return true;
    });
  }, [startDate, endDate]);

  // 2️⃣ Gom nhóm theo viewMode
  const groupedData = useMemo(() => {
    const map = {};

    filteredData.forEach((d) => {
      let key = "";
      if (viewMode === "day") {
        key = dayjs(d.date).format("DD/MM/YYYY");
      } else if (viewMode === "week") {
        const week = dayjs(d.date).week();
        const month = dayjs(d.date).format("MM");
        const year = dayjs(d.date).format("YYYY");
        key = `Tuần ${week} (${month}/${year})`;
      } else if (viewMode === "month") {
        key = dayjs(d.date).format("MM/YYYY");
      }

      if (!map[key]) {
        map[key] = { label: key, revenue: 0, count: 0 };
      }
      map[key].revenue += d.revenue;
      map[key].count++;
    });

    return Object.values(map);
  }, [filteredData, viewMode]);

  // 3️⃣ Tổng doanh thu
  const totalRevenue = groupedData.reduce((sum, d) => sum + d.revenue, 0);

  // 📤 Hàm xuất Excel
  const handleExportExcel = () => {
    const excelData = groupedData.map((item) => ({
      "Khoảng thời gian": item.label,
      "Tổng doanh thu (VND)": item.revenue,
      "Số lượng giao dịch": item.count,
    }));

    exportToExcel(excelData, "Revenue_Analytics");
  };

  return (
    <div>
      <CRow className="mb-4 align-items-center">
        <CCol>
          <h4>📊 Revenue Analytics</h4>
          <p style={{ color: "#666" }}>
            Phân tích doanh thu theo ngày / tuần / tháng
          </p>
        </CCol>
        <CCol className="text-end">
          <CButton color="success" onClick={handleExportExcel}>
            📤 Xuất Excel
          </CButton>
        </CCol>
      </CRow>

      {/* Bộ lọc */}
      <CCard className="mb-4">
        <CCardHeader>Bộ lọc</CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <CFormSelect
                label="Chế độ xem"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="day">Theo ngày</option>
                <option value="week">Theo tuần</option>
                <option value="month">Theo tháng</option>
              </CFormSelect>
            </CCol>
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
          <h5>Tổng doanh thu: {formatFullCurrency(totalRevenue)}</h5>
          <p style={{ color: "#666" }}>
            Tổng số khoảng thời gian: {groupedData.length}
          </p>
        </CCardBody>
      </CCard>

      {/* Biểu đồ */}
      <CCard>
        <CCardHeader>Biểu đồ doanh thu</CCardHeader>
        <CCardBody>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={groupedData}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={formatCompactCurrency} />
              <Tooltip formatter={(value) => formatFullCurrency(value)} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu (VND)" fill="#8884d8" />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ff7300"
                name="Xu hướng"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default RevenueAnalyticsPage;
