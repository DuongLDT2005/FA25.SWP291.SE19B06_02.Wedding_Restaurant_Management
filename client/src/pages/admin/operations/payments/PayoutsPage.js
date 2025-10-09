import React, { useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CBadge, CButton
} from "@coreui/react";

const PayoutListPage = () => {
  const [payouts, setPayouts] = useState([
    { id: 1, partner: "Sunflower Catering", paymentId: 1, amount: 9000000, status: "Pending" },
    { id: 2, partner: "Ocean Blue Events", paymentId: 2, amount: 7200000, status: "Paid" },
  ]);

  const handleMarkPaid = (id) => {
    setPayouts(prev =>
      prev.map(p => p.id === id ? { ...p, status: "Paid" } : p)
    );
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Payouts</strong>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Partner</CTableHeaderCell>
              <CTableHeaderCell>Payment ID</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {payouts.map((p) => (
              <CTableRow key={p.id}>
                <CTableHeaderCell>{p.id}</CTableHeaderCell>
                <CTableDataCell>{p.partner}</CTableDataCell>
                <CTableDataCell>
                  <a href={`/admin/payments/${p.paymentId}`}>#{p.paymentId}</a>
                </CTableDataCell>
                <CTableDataCell>{p.amount.toLocaleString()} VND</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={p.status === "Paid" ? "success" : "warning"}>
                    {p.status}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  {p.status !== "Paid" && (
                    <CButton color="primary" size="sm" onClick={() => handleMarkPaid(p.id)}>
                      Đánh dấu đã trả
                    </CButton>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default PayoutListPage;
