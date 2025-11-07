import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CCard, CCardBody, CCardHeader,
  CRow, CCol, CBadge, CButton,
  CModal, CModalHeader, CModalBody, CModalFooter, CFormInput
} from "@coreui/react";

// Fake data mô phỏng dữ liệu backend
const fakePayments = [
  {
    id: 1,
    customer: "Nguyễn Văn A",
    partner: "Sunflower Catering",
    amount: 10000000,
    method: "Credit Card",
    date: "2025-10-07",
    status: "Completed",
    release: false,
  },
  {
    id: 2,
    customer: "Trần Thị B",
    partner: "Ocean Blue Events",
    amount: 8000000,
    method: "Bank Transfer",
    date: "2025-10-06",
    status: "Pending",
    release: false,
  },
];

// ✅ Hàm định dạng tiền tệ VNĐ
const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// ✅ Hàm định dạng ngày (nếu muốn tùy biến thêm)
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("vi-VN");

const PaymentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(0);

  // ✅ Tìm payment theo ID
  const payment = fakePayments.find((p) => p.id === Number(id));

  // ❌ Không tìm thấy
  if (!payment) {
    return (
      <CCard className="mb-4">
        <CCardHeader>Payment Detail</CCardHeader>
        <CCardBody>
          <p>❌ Không tìm thấy Payment #{id}</p>
          <CButton color="secondary" onClick={() => navigate(-1)}>
            ← Quay lại
          </CButton>
        </CCardBody>
      </CCard>
    );
  }

  const { customer, partner, amount, method, date, status, release } = payment;

  const openPayoutModal = () => {
    setPayoutAmount(amount * 0.9);
    setVisible(true);
  };

  const confirmPayout = () => {
    console.log(`✅ Payout ${payoutAmount} VND created for ${partner}`);
    setVisible(false);
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Payment Detail — #{id}</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol sm={6}>
              <p><strong>Customer:</strong> {customer}</p>
              <p><strong>Partner:</strong> {partner}</p>
              <p><strong>Amount:</strong> {formatCurrency(amount)}</p>
            </CCol>
            <CCol sm={6}>
              <p><strong>Method:</strong> {method}</p>
              <p><strong>Date:</strong> {formatDate(date)}</p>
              <p>
                <strong>Status:</strong>{" "}
                <CBadge color={status === "Completed" ? "success" : "warning"}>
                  {status}
                </CBadge>
              </p>
            </CCol>
          </CRow>

          <div className="d-flex gap-2">
            {!release && status === "Completed" && (
              <CButton color="primary" onClick={openPayoutModal}>
                Tạo Payout
              </CButton>
            )}
            <CButton color="secondary" onClick={() => navigate(-1)}>
              ← Quay lại
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* Modal tạo Payout */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <strong>Tạo Payout</strong>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Payout Amount"
            type="number"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(Number(e.target.value))}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={confirmPayout}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default PaymentDetailPage;
