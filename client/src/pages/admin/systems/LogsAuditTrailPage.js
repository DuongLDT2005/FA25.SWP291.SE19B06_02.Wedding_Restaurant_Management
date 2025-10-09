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
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import dayjs from "dayjs";

// 🧪 Mock log data
const actions = ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"];
const users = ["Admin", "Owner01", "Customer01", "StaffA", "StaffB"];

const mockLogs = Array.from({ length: 250 }, (_, i) => {
  const date = dayjs().subtract(i, "hour");
  return {
    id: i + 1,
    user: users[Math.floor(Math.random() * users.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    description: `Hành động ${i + 1} được thực hiện`,
    timestamp: date.format("YYYY-MM-DD HH:mm:ss"),
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
  };
});

const LogsAuditTrailPage = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // 🧠 Lọc dữ liệu
  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      const matchSearch =
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.description.toLowerCase().includes(search.toLowerCase());
      const logDate = dayjs(log.timestamp);
      if (startDate && logDate.isBefore(dayjs(startDate))) return false;
      if (endDate && logDate.isAfter(dayjs(endDate).endOf("day"))) return false;
      return matchSearch;
    });
  }, [search, startDate, endDate]);

  // 📄 Phân trang
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <CRow className="mb-4">
        <CCol>
          <h4>📝 Audit Trail Logs</h4>
          <p style={{ color: "#666" }}>
            Theo dõi hoạt động hệ thống: đăng nhập, cập nhật, xoá dữ liệu, v.v.
          </p>
        </CCol>
      </CRow>

      {/* Bộ lọc */}
      <CCard className="mb-4">
        <CCardHeader>Bộ lọc</CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={3}>
              <CFormInput
                label="Tìm kiếm"
                placeholder="Từ khoá: user, action, mô tả..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
                  setSearch("");
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

      {/* Bảng log */}
      <CCard>
        <CCardHeader>Danh sách Logs</CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">User</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                <CTableHeaderCell scope="col">Timestamp</CTableHeaderCell>
                <CTableHeaderCell scope="col">IP</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <CTableRow key={log.id}>
                    <CTableHeaderCell>{log.id}</CTableHeaderCell>
                    <CTableDataCell>{log.user}</CTableDataCell>
                    <CTableDataCell>{log.action}</CTableDataCell>
                    <CTableDataCell>{log.description}</CTableDataCell>
                    <CTableDataCell>{log.timestamp}</CTableDataCell>
                    <CTableDataCell>{log.ip}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center text-muted">
                    Không có dữ liệu phù hợp
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          {/* Phân trang */}
          {totalPages > 1 && (
            <CPagination align="center" className="mt-3">
              {Array.from({ length: totalPages }, (_, i) => (
                <CPaginationItem
                  key={i + 1}
                  active={i + 1 === page}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
            </CPagination>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default LogsAuditTrailPage;
