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
  CButton,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";

const BookingListPage = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([
    {
      id: 1001,
      customer: "Nguyễn Văn A",
      restaurant: "Sunflower Wedding Hall",
      date: "2025-12-12",
      status: "Pending",
    },
    {
      id: 1002,
      customer: "Trần Thị B",
      restaurant: "Blue Ocean Center",
      date: "2025-11-01",
      status: "Confirmed",
    },
    {
      id: 1003,
      customer: "Lê Văn C",
      restaurant: "Green Garden",
      date: "2025-10-20",
      status: "Cancelled",
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

  const handleStatusChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    showToast(`Booking #${id} status changed to "${newStatus}"`);
  };

  return (
    <>
      <CToaster placement="top-end">{toast}</CToaster>

      <CCard className="mb-4">
        <CCardHeader>
          <strong>Booking Management</strong>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Customer</CTableHeaderCell>
                <CTableHeaderCell>Restaurant</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {bookings.map((b) => (
                <CTableRow key={b.id}>
                  <CTableHeaderCell>{b.id}</CTableHeaderCell>
                  <CTableDataCell>{b.customer}</CTableDataCell>
                  <CTableDataCell>{b.restaurant}</CTableDataCell>
                  <CTableDataCell>{b.date}</CTableDataCell>
                  <CTableDataCell>
                    <CFormSelect
                      size="sm"
                      value={b.status}
                      onChange={(e) =>
                        handleStatusChange(b.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="info"
                      variant="outline"
                      onClick={() => navigate(`/admin/bookings/${b.id}`)}
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

export default BookingListPage;
