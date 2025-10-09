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
  CFormSelect,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from "@coreui/react";

const PartnerListPage = () => {
  const [partners, setPartners] = useState([
    { id: 1, name: "Sunflower Catering", email: "contact@sunflower.vn", phone: "0909123456", status: "Active" },
    { id: 2, name: "Ocean Blue Events", email: "oceanblue@gmail.com", phone: "0988776655", status: "Pending" },
    { id: 3, name: "Green Garden Hall", email: "info@greengarden.vn", phone: "0911222333", status: "Inactive" },
  ]);

  const [toast, setToast] = useState(null);

  const showToast = (message, color = "success") => {
    setToast(
      <CToast color={color} autohide={true} visible={true}>
        <CToastHeader closeButton>System</CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
  };

  const handleStatusChange = (id, newStatus) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    // Giả lập "auto-save" bằng toast
    showToast(`Partner #${id} status changed to "${newStatus}"`);
  };

  return (
    <>
      <CToaster placement="top-end">{toast}</CToaster>

      <CCard className="mb-4">
        <CCardHeader>
          <strong>Partner Management</strong>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Partner Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {partners.map((p) => (
                <CTableRow key={p.id}>
                  <CTableHeaderCell>{p.id}</CTableHeaderCell>
                  <CTableDataCell>{p.name}</CTableDataCell>
                  <CTableDataCell>{p.email}</CTableDataCell>
                  <CTableDataCell>{p.phone}</CTableDataCell>
                  <CTableDataCell>
                    <CFormSelect
                      size="sm"
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </CFormSelect>
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

export default PartnerListPage;
