import React from "react";
import classNames from "classnames";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
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
dayjs.extend(weekOfYear);

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
  const cancelRate = totalBookings
    ? (totalCancellations / totalBookings) * 100
    : 0;
  const successRate = totalBookings
    ? (totalSuccessful / totalBookings) * 100
    : 0;

  return (
    <div>
      {/* Bộ lọc */}
      <CCard className="mb-4">
        <CCardHeader>Bộ lọc thời gian</CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <CFormSelect
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
                Reset
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/*Widgets */}
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
              <XAxis
                dataKey="label"
                interval={0}
                angle={-15}
                textAnchor="end"
                height={70}
              />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(val) => val.toLocaleString()} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                name="Doanh thu"
                fill="#8884d8"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                name="Bookings"
                stroke="#82ca9d"
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
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">
                          New Clients
                        </div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Recurring Clients
                        </div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />

                  {timeSeriesMetrics.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">
                          {item.title}
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Pageviews
                        </div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Organic
                        </div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {genderMetrics.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}%
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">
                      User
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">
                      Usage
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Payment Method
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">
                      Activity
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {UserMetrics.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar
                          size="md"
                          src={item.avatar.src}
                          status={item.avatar.status}
                        />
                      </CTableDataCell>
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
