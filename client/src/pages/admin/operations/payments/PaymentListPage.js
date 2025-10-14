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
} from "@coreui/react";
import { useNavigate } from "react-router-dom";

const formatCurrency = (value) => value.toLocaleString("vi-VN") + " VND";

const getStatusBadge = (status) => {
  switch (status) {
    case "Completed":
      return <CBadge color="success">Hoàn thành</CBadge>;
    case "Pending":
      return <CBadge color="warning">Đang xử lý</CBadge>;
    case "Failed":
      return <CBadge color="danger">Thất bại</CBadge>;
    default:
      return <CBadge color="secondary">{status}</CBadge>;
  }
};

const PaymentListPage = () => {
  const navigate = useNavigate();
  const [payments] = useState([
    {
      id: 1,
      customer: "Nguyễn Văn A",
      partner: "Sunflower Catering",
      amount: 10000000,
      date: "2025-10-07",
      method: "Credit Card",
      status: "Completed",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      partner: "Ocean Blue Events",
      amount: 8000000,
      date: "2025-10-06",
      method: "Bank Transfer",
      status: "Pending",
    },
  ]);

  return (
    <CCard className="mb-4 shadow-sm">
      <CCardHeader>
        <strong>Payment List</strong>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Khách hàng</CTableHeaderCell>
              <CTableHeaderCell>Đối tác</CTableHeaderCell>
              <CTableHeaderCell>Số tiền</CTableHeaderCell>
              <CTableHeaderCell>Ngày</CTableHeaderCell>
              <CTableHeaderCell>Phương thức</CTableHeaderCell>
              <CTableHeaderCell>Trạng thái</CTableHeaderCell>
              <CTableHeaderCell>Hành động</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {payments.map((p) => (
              <CTableRow key={p.id}>
                <CTableHeaderCell>{p.id}</CTableHeaderCell>
                <CTableDataCell>{p.customer}</CTableDataCell>
                <CTableDataCell>{p.partner}</CTableDataCell>
                <CTableDataCell>{formatCurrency(p.amount)}</CTableDataCell>
                <CTableDataCell>{p.date}</CTableDataCell>
                <CTableDataCell>{p.method}</CTableDataCell>
                <CTableDataCell>{getStatusBadge(p.status)}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="info"
                    variant="outline"
                    onClick={() => navigate(`/admin/payments/${p.id}`)}
                  >
                    Xem chi tiết
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default PaymentListPage;
