import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  CButton,
} from "@coreui/react";

const RestaurantListPage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: "Sunflower Wedding Hall",
      location: "Hà Nội",
      partner: "Sunflower Catering",
      status: "Active",
    },
    {
      id: 2,
      name: "Blue Ocean Center",
      location: "Đà Nẵng",
      partner: "Ocean Blue Events",
      status: "Pending",
    },
    {
      id: 3,
      name: "Green Garden",
      location: "TP. Hồ Chí Minh",
      partner: "Green Garden Hall",
      status: "Inactive",
    },
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
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`Restaurant #${id} status updated to "${newStatus}"`);
  };

  return (
    <>
      <CToaster placement="top-end">{toast}</CToaster>

      <CCard className="mb-4">
        <CCardHeader>
          <strong>Restaurant Management</strong>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Location</CTableHeaderCell>
                <CTableHeaderCell scope="col">Partner</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {restaurants.map((r) => (
                <CTableRow key={r.id}>
                  <CTableHeaderCell>{r.id}</CTableHeaderCell>
                  <CTableDataCell>{r.name}</CTableDataCell>
                  <CTableDataCell>{r.location}</CTableDataCell>
                  <CTableDataCell>{r.partner}</CTableDataCell>
                  <CTableDataCell>
                    <CFormSelect
                      size="sm"
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="info"
                      variant="outline"
                      onClick={() => navigate(`/admin/restaurants/${r.id}`)}
                    >
                      View
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

export default RestaurantListPage;
