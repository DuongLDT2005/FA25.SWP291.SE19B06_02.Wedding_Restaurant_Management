import React, { useState } from "react";
import {
  CCard, CCardBody, CCardHeader,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CModal, CModalHeader, CModalBody, CModalFooter, CFormInput, CToaster, CToast, CToastHeader, CToastBody
} from "@coreui/react";

const PaymentListPage = () => {
  const [payments] = useState([
    { id: 1, customer: "Nguyễn Văn A", amount: 10000000, date: "2025-10-07", method: "Credit Card", status: "Completed", partner: "Sunflower Catering" },
    { id: 2, customer: "Trần Thị B", amount: 8000000, date: "2025-10-06", method: "Bank Transfer", status: "Pending", partner: "Ocean Blue Events" },
  ]);

  const [visible, setVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, color = "success") => {
    setToast(
      <CToast color={color} autohide visible>
        <CToastHeader closeButton>System</CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
  };

  const handleCreatePayout = (payment) => {
    setSelectedPayment(payment);
    setPayoutAmount(payment.amount * 0.9); // ví dụ chi 90%
    setVisible(true);
  };

  const handleConfirmPayout = () => {
    // Ở đây ta có thể call API tạo payout tương ứng
    showToast(`Payout created for ${selectedPayment.partner}: ${payoutAmount.toLocaleString()} VND`);
    setVisible(false);
    setSelectedPayment(null);
  };

  return (
    <>
      <CToaster placement="top-end">{toast}</CToaster>

      <CCard className="mb-4">
        <CCardHeader>
          <strong>Payment List</strong>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Customer</CTableHeaderCell>
                <CTableHeaderCell>Partner</CTableHeaderCell>
                <CTableHeaderCell>Amount</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Method</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {payments.map((p) => (
                <CTableRow key={p.id}>
                  <CTableHeaderCell>{p.id}</CTableHeaderCell>
                  <CTableDataCell>{p.customer}</CTableDataCell>
                  <CTableDataCell>{p.partner}</CTableDataCell>
                  <CTableDataCell>{p.amount.toLocaleString()} VND</CTableDataCell>
                  <CTableDataCell>{p.date}</CTableDataCell>
                  <CTableDataCell>{p.method}</CTableDataCell>
                  <CTableDataCell>{p.status}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="success" size="sm" onClick={() => handleCreatePayout(p)}>
                      Tạo Payout
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <strong>Tạo Payout cho {selectedPayment?.partner}</strong>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="number"
            label="Payout Amount"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(Number(e.target.value))}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={handleConfirmPayout}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default PaymentListPage;
