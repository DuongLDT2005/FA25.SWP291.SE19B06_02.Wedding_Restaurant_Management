import React, { useState, useMemo } from "react";
import {
  formatCompactCurrency,
  formatFullCurrency,
} from "../../../utils/formatter";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
  CButton,
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
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
} from "recharts";

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "./Dashboard.css"; // 👈 Thêm dòng này

dayjs.extend(weekOfYear);

// 📨 Mock Notifications
const mockNotifications = Array.from({ length: 37 }).map((_, i) => ({
  id: i + 1,
  title: `Thông báo ${i + 1}`,
  message: `Đây là nội dung thông báo số ${i + 1}.`,
  date: dayjs().subtract(i, "hour").format("DD/MM/YYYY HH:mm"),
  type: i % 2 === 0 ? "success" : "warning",
}));

// 🧪 Mock Data
const mockData = Array.from({ length: 90 }, (_, i) => {
  const date = dayjs().subtract(i, "day");
  return {
    date: date.format("YYYY-MM-DD"),
    revenue: Math.floor(Math.random() * 15000000) + 3000000,
    bookings: Math.floor(Math.random() * 30) + 5,
    cancellations: Math.floor(Math.random() * 10),
    successful: Math.floor(Math.random() * 30) + 5,
    newCustomers: Math.floor(Math.random() * 15),
  };
}).reverse();

const mockPartners = ["Royal Palace", "Diamond Hall", "Paradise", "Hoa Sen"];
const mockPartnerStats = mockPartners.map((p) => ({
  partnerName: p,
  totalRevenue: Math.floor(Math.random() * 300000000) + 50000000,
  totalBookings: Math.floor(Math.random() * 800) + 200,
}));

const mockRecentCustomers = Array.from({ length: 8 }).map((_, i) => ({
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@mail.com`,
  lastBooking: dayjs()
    .subtract(Math.floor(Math.random() * 15), "day")
    .format("DD/MM/YYYY"),
  totalBookings: Math.floor(Math.random() * 10) + 1,
}));

const DashboardPage = () => {
  // 🔔 Notification pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mockNotifications.length / itemsPerPage);
  const currentNotifications = mockNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 📅 Dashboard filter state
  const [viewMode, setViewMode] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Lọc dữ liệu
  const filteredData = useMemo(() => {
    return mockData.filter((d) => {
      const date = dayjs(d.date);
      if (startDate && date.isBefore(dayjs(startDate))) return false;
      if (endDate && date.isAfter(dayjs(endDate))) return false;
      return true;
    });
  }, [startDate, endDate]);

  // Gom nhóm
  const groupedData = useMemo(() => {
    const map = {};
    filteredData.forEach((d) => {
      let key = "";
      if (viewMode === "day") key = dayjs(d.date).format("DD/MM/YYYY");
      else if (viewMode === "week") {
        const week = dayjs(d.date).week();
        const month = dayjs(d.date).format("MM");
        const year = dayjs(d.date).format("YYYY");
        key = `Tuần ${week} (${month}/${year})`;
      } else key = dayjs(d.date).format("MM/YYYY");

      if (!map[key]) {
        map[key] = {
          label: key,
          revenue: 0,
          bookings: 0,
          cancellations: 0,
          successful: 0,
          newCustomers: 0,
          count: 0,
        };
      }
      map[key].revenue += d.revenue;
      map[key].bookings += d.bookings;
      map[key].cancellations += d.cancellations;
      map[key].successful += d.successful;
      map[key].newCustomers += d.newCustomers;
      map[key].count++;
    });
    return Object.values(map);
  }, [filteredData, viewMode]);

  // Tính tổng
  const totalRevenue = groupedData.reduce((s, d) => s + d.revenue, 0);
  const totalBookings = groupedData.reduce((s, d) => s + d.bookings, 0);
  const totalCancellations = groupedData.reduce(
    (s, d) => s + d.cancellations,
    0
  );
  const totalSuccessful = groupedData.reduce((s, d) => s + d.successful, 0);
  const totalCustomers = groupedData.reduce((s, d) => s + d.newCustomers, 0);
  const cancelRate = totalBookings ? (totalCancellations / totalBookings) * 100 : 0;
  const successRate = totalBookings ? (totalSuccessful / totalBookings) * 100 : 0;

  return (
    <div className="dashboard-page">
      {/* 🔔 Notifications */}
      <CCard className="mb-4">
        <CCardHeader>🔔 Thông báo gần đây</CCardHeader>
        <CCardBody>
          {currentNotifications.length > 0 ? (
            <>
              {currentNotifications.map((n) => (
                <div
                  key={n.id}
                  className="mb-3 p-2 border rounded d-flex justify-content-between align-items-start"
                >
                  <div>
                    <strong>{n.title}</strong>
                    <div>{n.message}</div>
                    <small className="text-muted">{n.date}</small>
                  </div>
                  <CBadge color={n.type === "success" ? "success" : "warning"}>
                    {n.type.toUpperCase()}
                  </CBadge>
                </div>
              ))}

              {/* 📄 Pagination */}
              <div className="d-flex justify-content-center mt-3">
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        «
                      </button>
                    </li>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        »
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          ) : (
            <p className="text-center text-muted mb-0">Không có thông báo nào</p>
          )}
        </CCardBody>
      </CCard>

      {/* 📅 Bộ lọc */}
      <CCard className="mb-4">
        <CCardHeader>Bộ lọc thời gian</CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <CFormSelect value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
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
                Reset
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Widgets */}
      <CRow className="mb-4">
        {[
          { title: "Doanh thu", value: `${totalRevenue.toLocaleString()} VND` },
          { title: "Bookings", value: totalBookings },
          { title: "Partner", value: mockPartnerStats.length },
          { title: "Khách hàng mới", value: totalCustomers },
          { title: "Tỉ lệ huỷ", value: `${cancelRate.toFixed(1)}%` },
          { title: "Tỉ lệ thành công", value: `${successRate.toFixed(1)}%` },
        ].map((item, i) => (
          <CCol md={2} key={i} className="d-flex">
            <CCard className="flex-fill">
              <CCardBody
                className="text-center d-flex flex-column justify-content-center"
                style={{ minHeight: "120px" }}
              >
                <h6>{item.title}</h6>
                <h4 style={{ fontWeight: "bold" }}>{item.value}</h4>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Biểu đồ */}
      <CCard className="mb-4">
        <CCardHeader>📈 Doanh thu & Booking</CCardHeader>
        <CCardBody>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={groupedData}
              margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={0} angle={-15} textAnchor="end" height={70} />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => formatCompactCurrency(value)}
              />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(val, name) => {
                  if (name === "Doanh thu") {
                    return [formatFullCurrency(val), name];
                  }
                  return [val.toLocaleString(), name];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#8884d8" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                name="Bookings"
                stroke="#82ca9d"
                strokeWidth={5}
                dot={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </CCardBody>
      </CCard>

      {/* Bảng dưới */}
      <CRow>
        <CCol md={6}>
          <CCard>
            <CCardHeader>🏆 Top Partners</CCardHeader>
            <CCardBody>
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Đối tác</CTableHeaderCell>
                    <CTableHeaderCell>Doanh thu</CTableHeaderCell>
                    <CTableHeaderCell>Bookings</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {mockPartnerStats
                    .sort((a, b) => b.totalRevenue - a.totalRevenue)
                    .map((p, i) => (
                      <CTableRow key={i}>
                        <CTableDataCell>{i + 1}</CTableDataCell>
                        <CTableDataCell>{p.partnerName}</CTableDataCell>
                        <CTableDataCell>
                          {p.totalRevenue.toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell>{p.totalBookings}</CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard>
            <CCardHeader>👤 Khách hàng gần đây</CCardHeader>
            <CCardBody>
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Tên</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Lần đặt gần nhất</CTableHeaderCell>
                    <CTableHeaderCell>Tổng Booking</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {mockRecentCustomers.map((c, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell>{c.name}</CTableDataCell>
                      <CTableDataCell>{c.email}</CTableDataCell>
                      <CTableDataCell>{c.lastBooking}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{c.totalBookings}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default DashboardPage;

//Add bua de fix loi