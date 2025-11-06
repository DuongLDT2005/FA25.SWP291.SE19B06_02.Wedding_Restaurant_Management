import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CBadge,
} from "@coreui/react";
import { mockUsers } from "../management/users/UserList";

const LicenseCommissionPage = () => {
  const [partners, setPartners] = useState(
    mockUsers.filter((u) => u.role === "Partner" && !u.approved)
  );
  const [commissionList, setCommissionList] = useState(
    mockUsers.filter((u) => u.role === "Partner" && u.approved)
  );
  const [activeTab, setActiveTab] = useState("partner");

  const handleApprove = (id) => {
    const partner = partners.find((p) => p.id === id);
    Swal.fire({
      title: "Approve this partner?",
      text: `You are about to approve ${partner.name}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      background: "#1e1e2f",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
        setCommissionList((prev) => [
          ...prev,
          { ...partner, approved: true, approvedAt: new Date().toISOString().split("T")[0] },
        ]);
        Swal.fire({
          title: "Approved!",
          text: `${partner.name} moved to commission list.`,
          icon: "success",
          background: "#1e1e2f",
          color: "#fff",
        });
      }
    });
  };

  const handleReject = (id) => {
    const partner = partners.find((p) => p.id === id);
    Swal.fire({
      title: "Reject this partner?",
      text: `Are you sure to reject ${partner.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      background: "#1e1e2f",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({
          title: "Rejected!",
          text: `${partner.name} has been removed.`,
          icon: "info",
          background: "#1e1e2f",
          color: "#fff",
        });
      }
    });
  };

  const renderPartnerTable = () => (
    <CTable hover responsive className="align-middle text-light">
      <CTableHead color="dark">
        <CTableRow>
          <CTableHeaderCell>#</CTableHeaderCell>
          <CTableHeaderCell>Partner Name</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>License</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {partners.length > 0 ? (
          partners.map((partner, index) => (
            <CTableRow key={partner.id}>
              <CTableHeaderCell>{index + 1}</CTableHeaderCell>
              <CTableDataCell>
                <strong>{partner.name}</strong>
              </CTableDataCell>
              <CTableDataCell>{partner.email}</CTableDataCell>
              <CTableDataCell>
                <a
                  href={partner.licenseURL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View License
                </a>
              </CTableDataCell>
              <CTableDataCell className="text-center">
                <CButton
                  color="success"
                  size="sm"
                  className="me-2"
                  onClick={() => handleApprove(partner.id)}
                >
                  Approve
                </CButton>
                <CButton
                  color="danger"
                  size="sm"
                  onClick={() => handleReject(partner.id)}
                >
                  Reject
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan="5" className="text-center text-muted">
              No pending partners.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  );

  const renderCommissionTable = () => (
    <CTable hover responsive className="align-middle text-light">
      <CTableHead color="dark">
        <CTableRow>
          <CTableHeaderCell>#</CTableHeaderCell>
          <CTableHeaderCell>Partner Name</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Restaurants</CTableHeaderCell>
          <CTableHeaderCell>License</CTableHeaderCell>
          <CTableHeaderCell>Commission</CTableHeaderCell>
          <CTableHeaderCell>Approved At</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {commissionList.length > 0 ? (
          commissionList.map((partner, index) => (
            <CTableRow key={partner.id}>
              <CTableHeaderCell>{index + 1}</CTableHeaderCell>
              <CTableDataCell>
                <strong>{partner.name}</strong>
              </CTableDataCell>
              <CTableDataCell>{partner.email}</CTableDataCell>
              <CTableDataCell>
                {partner.restaurants?.map((r, i) => (
                  <div key={i}>
                    • {r.name} – <span className="text-success">{r.status}</span>
                  </div>
                ))}
              </CTableDataCell>
              <CTableDataCell>
                <a
                  href={partner.licenseURL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View License
                </a>
              </CTableDataCell>
              <CTableDataCell>
                <CBadge color="info" className="px-3 py-2">
                  {partner.commissionRate ? `${partner.commissionRate}%` : "N/A"}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>
                {partner.approvedAt || "—"}
              </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan="7" className="text-center text-muted">
              No approved partners yet.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  );

  return (
    <CCard className="mb-4 shadow-sm bg-dark text-light">
      <CCardHeader className="bg-secondary text-light">
        <h5 className="mb-0 fw-bold">Partner License & Commission Management</h5>
      </CCardHeader>

      <CNav variant="tabs" role="tablist" className="px-3 pt-2 bg-dark">
        <CNavItem>
          <CNavLink
            active={activeTab === "partner"}
            onClick={() => setActiveTab("partner")}
            role="button"
            className="text-light"
          >
            Approve Partner
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === "commission"}
            onClick={() => setActiveTab("commission")}
            role="button"
            className="text-light"
          >
            Approved Commissions
          </CNavLink>
        </CNavItem>
      </CNav>

      <CCardBody className="bg-dark">
        {activeTab === "partner" ? renderPartnerTable() : renderCommissionTable()}
      </CCardBody>
    </CCard>
  );
};

export default LicenseCommissionPage;
