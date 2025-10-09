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
  CBadge,
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

// 🧪 Mock customer data
const customers = [
  "Nguyễn Văn A",
  "Trần Thị B",
  "Lê Văn C",
  "Phạm Thị D",
  "Hoàng Văn E",
  "Võ Thị F",
  "Bùi Văn G",
];

const mockCustomerData = Array.from({ length: 200 }, (_, i) => {
  const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
  return Array.from({ length: Math.floor(Math.random() * 8) + 3 }).map(() => {
    const customerName = customers[Math.floor(Math.random() * customers.length)];
    return {
      date,
      customerId: customerName,
      customerName,
      revenue: Math.floor(Math.random() * 15000000) + 1000000,
      bookings: Math.floor(Math.random() * 3) + 1,
    };
  });
}).flat();

const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

const CustomerInsightPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🧠 Lọc dữ liệu theo khoảng thời gian
  const filteredData = useMemo(() => {
    return mockCustomerData.filter((d) => {
      const date = dayjs(d.date);
      if (startDate && date.isBefore(dayjs(startDate))) return false;
      if (endDate && date.isAfter(dayjs(endDate))) return false;
      return true;
    });
  }, [startDate, endDate]);

  // 📊 Gom nhóm theo khách hàng
  const customerSummary = useMemo(() => {
    const map = {};
    filteredData.forEach((d) => {
      if (!map[d.customerId]) {
        map[d.customerId] = {
          customerId: d.customerId,
          customerName: d.customerName,
          totalRevenue: 0,
          totalBookings: 0,
        };
      }
      map[d.customerId].totalRevenue += d.revenue;
      map[d.customerId].totalBookings += d.bookings;
    });
    return Object.values(map).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [filteredData]);

  const totalRevenue = customerSummary.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalBookings = customerSummary.reduce((sum, c) => sum + c.totalBookings, 0);
  const loyalCustomer = customerSummary[0];

  return (
    <div>
      <CRow className="mb-4">
        <CCol>
          <h4>🧍 Customer Insight</h4>
          <p style={{ color: "#666" }}>
            Phân tích hành vi & giá trị của khách hàng
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
      <CRow className="mb-4">
        <CCol md={4}>
          <CCard>
            <CCardBody>
              <h6>Tổng doanh thu</h6>
              <h3>{formatNumber(totalRevenue)} VND</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard>
            <CCardBody>
              <h6>Tổng lượt booking</h6>
              <h3>{totalBookings}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard>
            <CCardBody>
              <h6>Khách hàng trung thành nhất</h6>
              {loyalCustomer ? (
                <>
                  <h5>{loyalCustomer.customerName}</h5>
                  <p>
                    {loyalCustomer.totalBookings} bookings •{" "}
                    {formatNumber(loyalCustomer.totalRevenue)} VND
                  </p>
                  <CBadge color="success">Top 1</CBadge>
                </>
              ) : (
                <p>Chưa có dữ liệu</p>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Biểu đồ Top khách hàng */}
      <CCard className="mb-4">
        <CCardHeader>Top khách hàng theo doanh thu</CCardHeader>
        <CCardBody>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={customerSummary.slice(0, 10)}
              margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="customerName"
                interval={0}
                angle={-25}
                textAnchor="end"
                height={80}
              />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(val) => val.toLocaleString()} />
              <Legend />
              <Bar dataKey="totalRevenue" name="Doanh thu (VND)" fill="#8884d8" />
              <Bar dataKey="totalBookings" name="Bookings" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CCardBody>
      </CCard>

      {/* Bảng xếp hạng khách hàng */}
      <CCard>
        <CCardHeader>Bảng xếp hạng khách hàng</CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Tên khách hàng</CTableHeaderCell>
                <CTableHeaderCell>Doanh thu</CTableHeaderCell>
                <CTableHeaderCell>Bookings</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {customerSummary.slice(0, 20).map((c, idx) => (
                <CTableRow key={c.customerId}>
                  <CTableHeaderCell>{idx + 1}</CTableHeaderCell>
                  <CTableDataCell>{c.customerName}</CTableDataCell>
                  <CTableDataCell>{c.totalRevenue.toLocaleString()} VND</CTableDataCell>
                  <CTableDataCell>{c.totalBookings}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CustomerInsightPage;
