import React, { useState, useMemo } from "react";
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
  BarChart,
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
dayjs.extend(weekOfYear);

// 🧪 Mock data — có thể thay bằng API sau này
const mockRevenue = Array.from({ length: 90 }, (_, i) => {
  const date = dayjs().subtract(i, "day");
  return {
    date: date.format("YYYY-MM-DD"),
    revenue: Math.floor(Math.random() * 20000000) + 2000000, // 2tr - 20tr
  };
}).reverse();

// 🔢 Hàm định dạng số ngắn gọn trên trục Y
const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value;
};

// 💬 Hàm định dạng tooltip
const formatTooltip = (value) => {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const RevenueAnalyticsPage = () => {
  const [viewMode, setViewMode] = useState("month"); // "day" | "week" | "month"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 1️⃣ Lọc dữ liệu theo khoảng thời gian
  const filteredData = useMemo(() => {
    return mockRevenue.filter((d) => {
      const date = dayjs(d.date);
      if (startDate && date.isBefore(dayjs(startDate))) return false;
      if (endDate && date.isAfter(dayjs(endDate))) return false;
      return true;
    });
  }, [startDate, endDate]);

  // 2️⃣ Gom nhóm theo chế độ xem
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

  // 3️⃣ Tính tổng doanh thu
  const totalRevenue = groupedData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div>
      <CRow className="mb-4">
        <CCol>
          <h4>📊 Revenue Analytics</h4>
          <p style={{ color: "#666" }}>
            Phân tích doanh thu theo ngày / tuần / tháng
          </p>
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
          <h5>Tổng doanh thu: {totalRevenue.toLocaleString()} VND</h5>
          <p style={{ color: "#666" }}>
            Tổng số bản ghi: {groupedData.length}
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
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatTooltip(value)} />
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
