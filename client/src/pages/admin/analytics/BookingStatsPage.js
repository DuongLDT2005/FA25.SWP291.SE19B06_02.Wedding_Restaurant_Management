import React, { useState, useMemo } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CFormInput,
} from "@coreui/react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

// Mock booking data (90 ngày gần nhất)
const mockBookings = Array.from({ length: 90 }, (_, i) => {
  const date = dayjs().subtract(i, "day");
  return {
    date: date.format("YYYY-MM-DD"),
    bookings: Math.floor(Math.random() * 20) + 5,
  };
}).reverse();

const BookingStatsPage = () => {
  const [viewMode, setViewMode] = useState("month"); // day | week | month
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Lọc dữ liệu theo khoảng ngày
  const filteredData = useMemo(() => {
    return mockBookings.filter((item) => {
      const d = dayjs(item.date);
      if (startDate && d.isBefore(dayjs(startDate))) return false;
      if (endDate && d.isAfter(dayjs(endDate))) return false;
      return true;
    });
  }, [startDate, endDate]);

  // Gom nhóm theo chế độ xem
  const groupedData = useMemo(() => {
    const map = {};

    filteredData.forEach((item) => {
      const date = dayjs(item.date);
      let key = "";

      if (viewMode === "day") {
        key = date.format("DD/MM");
      } else if (viewMode === "week") {
        const week = date.week();
        key = `Tuần ${week}/${date.format("YYYY")}`;
      } else {
        key = date.format("MM/YYYY");
      }

      if (!map[key]) {
        map[key] = { label: key, bookings: 0 };
      }
      map[key].bookings += item.bookings;
    });

    return Object.values(map);
  }, [filteredData, viewMode]);

  const totalBookings = groupedData.reduce((sum, d) => sum + d.bookings, 0);

  return (
    <div>
      <CRow className="mb-4">
        <CCol>
          <h4>📈 Booking Statistics</h4>
          <p style={{ color: "#666" }}>
            Thống kê số lượng booking theo ngày / tuần / tháng
          </p>
        </CCol>
        <CCol className="text-end">
          <div className="d-inline-flex gap-2">
            <CButton
              color={viewMode === "day" ? "primary" : "secondary"}
              variant={viewMode === "day" ? "solid" : "outline"}
              onClick={() => setViewMode("day")}
            >
              Ngày
            </CButton>
            <CButton
              color={viewMode === "week" ? "primary" : "secondary"}
              variant={viewMode === "week" ? "solid" : "outline"}
              onClick={() => setViewMode("week")}
            >
              Tuần
            </CButton>
            <CButton
              color={viewMode === "month" ? "primary" : "secondary"}
              variant={viewMode === "month" ? "solid" : "outline"}
              onClick={() => setViewMode("month")}
            >
              Tháng
            </CButton>
          </div>
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
          <h5>Tổng số bookings: {totalBookings}</h5>
          <p style={{ color: "#666" }}>Tổng số bản ghi: {groupedData.length}</p>
        </CCardBody>
      </CCard>

      {/* Biểu đồ */}
      <CCard>
        <CCardHeader>Biểu đồ Booking</CCardHeader>
        <CCardBody>
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={groupedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  angle={-20}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default BookingStatsPage;
