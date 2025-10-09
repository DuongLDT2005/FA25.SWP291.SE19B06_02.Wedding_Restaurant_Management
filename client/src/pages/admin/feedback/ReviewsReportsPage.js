import React, { useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CFormSelect, CButton, CBadge,
  CToaster, CToast, CToastHeader, CToastBody,
  CNav, CNavItem, CNavLink, CTabContent, CTabPane
} from "@coreui/react";

const ReviewsReportsPage = () => {
  // ================= REVIEWS ==================
  const [reviews, setReviews] = useState([
    { id: 1, customer: "Nguyễn Văn A", restaurant: "Sunflower Catering", rating: 5, comment: "Dịch vụ tuyệt vời!", date: "2025-10-06", status: "Approved" },
    { id: 2, customer: "Trần Thị B", restaurant: "Ocean Blue Events", rating: 3, comment: "Phục vụ hơi chậm", date: "2025-10-05", status: "Pending" },
    { id: 3, customer: "Lê Văn C", restaurant: "Green Garden Hall", rating: 1, comment: "Rất thất vọng!", date: "2025-10-04", status: "Rejected" },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    showToast(`Review #${id} status changed to "${newStatus}"`);
  };

  const handleDeleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast(`Review #${id} deleted`, "danger");
  };

  // ================= REPORTS ==================
  const [reports, setReports] = useState([
    { id: 1, reviewId: 3, reporter: "Admin", reason: "Ngôn ngữ không phù hợp", date: "2025-10-06", status: "Pending" },
    { id: 2, reviewId: 2, reporter: "Customer", reason: "Spam quảng cáo", date: "2025-10-05", status: "Resolved" },
  ]);

  const handleReportStatusChange = (id, newStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    showToast(`Report #${id} marked as "${newStatus}"`);
  };

  const handleDeleteReport = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    showToast(`Report #${id} deleted`, "danger");
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
          <CNavLink
            active={activeTab === 1}
            onClick={() => setActiveTab(1)}
          >
            📝 Reviews
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 2}
            onClick={() => setActiveTab(2)}
          >
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
                    <CTableRow key={r.id}>
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
                        <CFormSelect
                          size="sm"
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        >
                          <option value="Approved">Approved</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                        </CFormSelect>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteReview(r.id)}
                        >
                          Xóa
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
                    <CTableHeaderCell>Review ID</CTableHeaderCell>
                    <CTableHeaderCell>Reporter</CTableHeaderCell>
                    <CTableHeaderCell>Reason</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {reports.map((r) => (
                    <CTableRow key={r.id}>
                      <CTableHeaderCell>{r.id}</CTableHeaderCell>
                      <CTableDataCell>
                        <a href={`/admin/reviews#review-${r.reviewId}`}>#{r.reviewId}</a>
                      </CTableDataCell>
                      <CTableDataCell>{r.reporter}</CTableDataCell>
                      <CTableDataCell>{r.reason}</CTableDataCell>
                      <CTableDataCell>{r.date}</CTableDataCell>
                      <CTableDataCell>
                        <CFormSelect
                          size="sm"
                          value={r.status}
                          onChange={(e) => handleReportStatusChange(r.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Dismissed">Dismissed</option>
                        </CFormSelect>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteReport(r.id)}
                        >
                          Xóa
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
    </>
  );
};

export default ReviewsReportsPage;
