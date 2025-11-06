import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";

// Giả lập chung dữ liệu
const bookings = [
  { id: 1001, customer: "Nguyễn Văn A", restaurant: "Sunflower Wedding Hall", date: "2025-12-12", status: "Pending" },
  { id: 1002, customer: "Trần Thị B", restaurant: "Blue Ocean Center", date: "2025-11-01", status: "Confirmed" },
  { id: 1003, customer: "Lê Văn C", restaurant: "Green Garden", date: "2025-10-20", status: "Cancelled" },
];

const payments = [
  { id: 1, bookingId: 1001, partner: "Sunflower Catering", amount: 10000000, date: "2025-10-07", method: "Credit Card", status: "Completed" },
  { id: 2, bookingId: 1002, partner: "Ocean Blue Events", amount: 8000000, date: "2025-10-06", method: "Bank Transfer", status: "Pending" },
];

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = bookings.find((b) => b.id === Number(id));

  if (!booking) {
    return (
      <CCard className="mb-4">
        <CCardHeader>Booking Detail</CCardHeader>
        <CCardBody>
          <p>❌ Booking #{id} not found.</p>
          <CButton color="secondary" onClick={() => navigate(-1)}>
            Back
          </CButton>
        </CCardBody>
      </CCard>
    );
  }

  const relatedPayments = payments.filter((p) => p.bookingId === booking.id);

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Booking Detail — #{booking.id}</strong>
      </CCardHeader>
      <CCardBody>
        <p><strong>Customer:</strong> {booking.customer}</p>
        <p><strong>Restaurant:</strong> {booking.restaurant}</p>
        <p><strong>Date:</strong> {booking.date}</p>
        <p><strong>Status:</strong> {booking.status}</p>

        <hr />
        <h5>Payments</h5>
        {relatedPayments.length > 0 ? (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Partner</CTableHeaderCell>
                <CTableHeaderCell>Amount</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {relatedPayments.map((p) => (
                <CTableRow key={p.id}>
                  <CTableHeaderCell>{p.id}</CTableHeaderCell>
                  <CTableDataCell>{p.partner}</CTableDataCell>
                  <CTableDataCell>{p.amount.toLocaleString()} VND</CTableDataCell>
                  <CTableDataCell>{p.date}</CTableDataCell>
                  <CTableDataCell>{p.status}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="info"
                      onClick={() => navigate(`/admin/payments/${p.id}`)}
                    >
                      View Payment
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p>No payments found for this booking.</p>
        )}

        <CButton color="secondary" className="mt-3" onClick={() => navigate(-1)}>
          ← Back
        </CButton>
      </CCardBody>
    </CCard>
  );
};

export default BookingDetailPage;
