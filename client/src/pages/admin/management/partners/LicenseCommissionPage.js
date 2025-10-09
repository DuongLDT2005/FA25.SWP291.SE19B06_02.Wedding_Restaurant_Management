import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from "@coreui/react";

const LicenseCommissionPage = () => {
  const [partners, setPartners] = useState([
    {
      id: 1,
      name: "Sunflower Catering",
      license: "LC-2023-001",
      verified: true,
      commissionRate: "10%",
    },
    {
      id: 2,
      name: "Ocean Blue Events",
      license: "LC-2023-045",
      verified: false,
      commissionRate: "8%",
    },
    {
      id: 3,
      name: "Green Garden Hall",
      license: "LC-2023-078",
      verified: false,
      commissionRate: "12%",
    },
  ]);

  const [toast, setToast] = useState(null);

  const showToast = (message, color = "success") => {
    setToast(
      <CToast color={color} autohide visible>
        <CToastHeader closeButton>System</CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
  };

  const handleVerify = (id) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, verified: true } : p
      )
    );
    showToast(`License for partner #${id} verified successfully`);
  };

  return (
    <>
      <CToaster placement="top-end">{toast}</CToaster>

      <CCard className="mb-4">
        <CCardHeader>
          <strong>Partner License & Commission Verification</strong>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Partner Name</CTableHeaderCell>
                <CTableHeaderCell>License No.</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Commission Rate</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {partners.map((p) => (
                <CTableRow key={p.id}>
                  <CTableHeaderCell>{p.id}</CTableHeaderCell>
                  <CTableDataCell>{p.name}</CTableDataCell>
                  <CTableDataCell>{p.license}</CTableDataCell>
                  <CTableDataCell>
                    {p.verified ? (
                      <CBadge color="success">Verified</CBadge>
                    ) : (
                      <CBadge color="warning">Pending</CBadge>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>{p.commissionRate}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color={p.verified ? "secondary" : "primary"}
                      size="sm"
                      disabled={p.verified}
                      onClick={() => handleVerify(p.id)}
                    >
                      {p.verified ? "Verified" : "Verify Now"}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  );
};

export default LicenseCommissionPage;
