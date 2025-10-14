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
} from "@coreui/react";
import { mockUsers } from "../management/users/UserList";

const LicenseCommissionPage = () => {
  const [partners, setPartners] = useState(
    mockUsers.filter((u) => u.role === "Partner")
  );
  const [commissionList, setCommissionList] = useState([]);
  const [activeTab, setActiveTab] = useState("partner");

  const handleVerify = (id) => {
    const partner = partners.find((p) => p.id === id);
    Swal.fire({
      title: "Approve this partner?",
      text: `You are about to approve ${partner.name}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
        setCommissionList((prev) => [
          ...prev,
          { ...partner, commissionRate: null },
        ]);
        Swal.fire("Approved!", `${partner.name} moved to commission list.`, "success");
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
    }).then((result) => {
      if (result.isConfirmed) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
        Swal.fire("Rejected!", `${partner.name} has been removed.`, "info");
      }
    });
  };

  const handleNegotiate = (id) => {
    const partner = commissionList.find((p) => p.id === id);
    Swal.fire({
      title: `Negotiate Commission for ${partner.name}`,
      input: "number",
      inputAttributes: { min: 0, max: 100, step: 1 },
      inputLabel: "Enter commission rate (%)",
      inputPlaceholder: "e.g. 15",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      preConfirm: (rate) => {
        if (!rate || rate < 0 || rate > 100) {
          Swal.showValidationMessage("Please enter a valid rate (0–100%)");
        }
        return rate;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = commissionList.map((p) =>
          p.id === id ? { ...p, commissionRate: result.value } : p
        );
        setCommissionList(updated);
        Swal.fire(
          "Saved!",
          `${partner.name}'s commission set to ${result.value}%`,
          "success"
        );
      }
    });
  };

  const renderPartnerTable = () => (
    <CTable hover responsive>
      <CTableHead color="black">
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
                  href="https://example.com/license.pdf"
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
                  onClick={() => handleVerify(partner.id)}
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
    <CTable hover responsive>
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell>#</CTableHeaderCell>
          <CTableHeaderCell>Partner Name</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Commission</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Negotiation</CTableHeaderCell>
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
              <CTableDataCell className="text-success fw-semibold">
                {partner.commissionRate
                  ? `${partner.commissionRate}%`
                  : "Pending negotiation"}
              </CTableDataCell>
              <CTableDataCell className="text-center">
                <CButton
                  color="warning"
                  size="sm"
                  onClick={() => handleNegotiate(partner.id)}
                >
                  Negotiate
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan="5" className="text-center text-muted">
              No commission negotiations yet.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  );

  return (
    <CCard className="mb-4 shadow-sm">
      <CCardHeader>
        <h5 className="mb-0 fw-bold">Partner License & Commission Management</h5>
      </CCardHeader>

      {/* Tabs */}
      <CNav variant="tabs" role="tablist" className="px-3 pt-2">
        <CNavItem>
          <CNavLink
            active={activeTab === "partner"}
            onClick={() => setActiveTab("partner")}
            role="button"
          >
            Approve Partner
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === "commission"}
            onClick={() => setActiveTab("commission")}
            role="button"
          >
            Approve Commission
          </CNavLink>
        </CNavItem>
      </CNav>

      <CCardBody>
        {activeTab === "partner" ? renderPartnerTable() : renderCommissionTable()}
      </CCardBody>
    </CCard>
  );
};

export default LicenseCommissionPage;
