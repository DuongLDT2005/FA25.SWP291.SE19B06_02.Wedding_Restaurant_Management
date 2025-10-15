import React, { useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CBadge,
  CToaster, CToast, CToastHeader, CToastBody,
  CNav, CNavItem, CNavLink, CTabContent, CTabPane,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from "@coreui/react";

const ReviewsReportsPage = () => {
  // ================= REVIEWS ==================
  const [reviews, setReviews] = useState([
    { id: 1, customer: "Nguyễn Văn A", restaurant: "Sunflower Catering", rating: 5, comment: "Dịch vụ tuyệt vời!", date: "2025-10-06", hidden: false },
    { id: 2, customer: "Trần Thị B", restaurant: "Ocean Blue Events", rating: 3, comment: "Phục vụ hơi chậm", date: "2025-10-05", hidden: false },
    { id: 3, customer: "Lê Văn C", restaurant: "Green Garden Hall", rating: 1, comment: "Rất thất vọng!", date: "2025-10-04", hidden: true },
  ]);

  const handleHideReview = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r));
    showToast(`Review #${id} ${reviews.find(r => r.id === id)?.hidden ? "đã hiện lại" : "đã ẩn"}`);
  };

  // ================= REPORTS ==================
  const [reports, setReports] = useState([
    { id: 1, type: "review", reviewId: 3, reporter: "Admin", reason: "Ngôn ngữ không phù hợp", date: "2025-10-06", hidden: false },
    { id: 2, type: "restaurant", restaurant: "Sunflower Catering", reporter: "Customer", reason: "Quảng cáo sai sự thật", date: "2025-10-05", hidden: false },
  ]);

  const handleHideReport = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r));
    showToast(`Report #${id} ${reports.find(r => r.id === id)?.hidden ? "đã hiện lại" : "đã ẩn"}`);
  };

  // ================= MODAL XEM CHI TIẾT ==================
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  // ================= TOAST ==================
  const [toast, setToast] = useState(null);
  const showToast = (message, color = "success") => {
    setToast(
      <CToast color={color} autohide visible>
        <CToastHeader closeButton>System</CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
  };

  // ================= TABS ==================
  const [activeTab, setActiveTab] = useState(1);

  return (
    <>
      <CToaster placement="top-end">{toast}</CToaster>

      <CNav variant="tabs" role="tablist" className="mb-3">
        <CNavItem>
          <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
            📝 Reviews
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)}>
            📊 Reports
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        {/* ================== REVIEWS TAB ================== */}
        <CTabPane role="tabpanel" visible={activeTab === 1}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Customer Reviews</strong>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Customer</CTableHeaderCell>
                    <CTableHeaderCell>Restaurant</CTableHeaderCell>
                    <CTableHeaderCell>Rating</CTableHeaderCell>
                    <CTableHeaderCell>Comment</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {reviews.map((r) => (
                    <CTableRow
                      key={r.id}
                      style={r.hidden ? { opacity: 0.5 } : {}}
                    >
                      <CTableHeaderCell>{r.id}</CTableHeaderCell>
                      <CTableDataCell>{r.customer}</CTableDataCell>
                      <CTableDataCell>{r.restaurant}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={r.rating >= 4 ? "success" : r.rating >= 2 ? "warning" : "danger"}>
                          {r.rating} ★
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell style={{ maxWidth: "250px", whiteSpace: "pre-wrap" }}>
                        {r.comment}
                      </CTableDataCell>
                      <CTableDataCell>{r.date}</CTableDataCell>
                      <CTableDataCell>
                        {r.hidden ? <CBadge color="secondary">Ẩn</CBadge> : <CBadge color="success">Hiển thị</CBadge>}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color={r.hidden ? "secondary" : "warning"}
                          size="sm"
                          variant="outline"
                          onClick={() => handleHideReview(r.id)}
                        >
                          {r.hidden ? "Hiện lại" : "Ẩn"}
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CTabPane>

        {/* ================== REPORTS TAB ================== */}
        <CTabPane role="tabpanel" visible={activeTab === 2}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Reports</strong>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Loại</CTableHeaderCell>
                    <CTableHeaderCell>Đối tượng</CTableHeaderCell>
                    <CTableHeaderCell>Reporter</CTableHeaderCell>
                    <CTableHeaderCell>Reason</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {reports.map((r) => (
                    <CTableRow
                      key={r.id}
                      style={r.hidden ? { opacity: 0.5 } : {}}
                    >
                      <CTableHeaderCell>{r.id}</CTableHeaderCell>
                      <CTableDataCell>
                        <CBadge color={r.type === "restaurant" ? "info" : "primary"}>
                          {r.type === "restaurant" ? "Restaurant" : "Review"}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {r.type === "restaurant" ? r.restaurant : `Review #${r.reviewId}`}
                      </CTableDataCell>
                      <CTableDataCell>{r.reporter}</CTableDataCell>
                      <CTableDataCell>{r.reason}</CTableDataCell>
                      <CTableDataCell>{r.date}</CTableDataCell>
                      <CTableDataCell>
                        {r.hidden ? <CBadge color="secondary">Ẩn</CBadge> : <CBadge color="success">Hiển thị</CBadge>}
                      </CTableDataCell>
                      <CTableDataCell className="d-flex gap-2">
                        <CButton size="sm" color="info" variant="outline" onClick={() => handleViewDetail(r)}>
                          Xem chi tiết
                        </CButton>
                        <CButton
                          color={r.hidden ? "secondary" : "warning"}
                          size="sm"
                          variant="outline"
                          onClick={() => handleHideReport(r.id)}
                        >
                          {r.hidden ? "Hiện lại" : "Ẩn"}
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CTabPane>
      </CTabContent>

      {/* Modal Xem Chi Tiết */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Chi tiết Report</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedReport && (
            <>
              <p><strong>ID:</strong> {selectedReport.id}</p>
              <p><strong>Loại:</strong> {selectedReport.type}</p>
              {selectedReport.type === "restaurant" ? (
                <p><strong>Nhà hàng:</strong> {selectedReport.restaurant}</p>
              ) : (
                <p><strong>Review ID:</strong> {selectedReport.reviewId}</p>
              )}
              <p><strong>Reporter:</strong> {selectedReport.reporter}</p>
              <p><strong>Lý do:</strong> {selectedReport.reason}</p>
              <p><strong>Ngày:</strong> {selectedReport.date}</p>
              <p><strong>Trạng thái:</strong> {selectedReport.hidden ? "Ẩn" : "Hiển thị"}</p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>Đóng</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default ReviewsReportsPage;
