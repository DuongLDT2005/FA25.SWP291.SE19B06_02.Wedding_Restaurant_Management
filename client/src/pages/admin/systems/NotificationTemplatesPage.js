import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const mockTemplates = [
  { id: 1, name: "Đặt chỗ thành công", type: "Email", subject: "Xác nhận đặt chỗ", updatedAt: "2025-09-01" },
  { id: 2, name: "Thanh toán thành công", type: "SMS", subject: "Cảm ơn bạn", updatedAt: "2025-09-03" },
];

const NotificationTemplatesPage = () => {
  const [templates, setTemplates] = useState(mockTemplates);
  const [visible, setVisible] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", type: "", subject: "" });

  const handleAdd = () => {
    if (!newTemplate.name || !newTemplate.type) return;
    const t = {
      ...newTemplate,
      id: Date.now(),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setTemplates([...templates, t]);
    setVisible(false);
    setNewTemplate({ name: "", type: "", subject: "" });
  };

  return (
    <div>
      <CRow className="mb-3">
        <CCol>
          <h4>📩 Notification Templates</h4>
        </CCol>
        <CCol className="text-end">
          <CButton color="primary" onClick={() => setVisible(true)}>
            + Thêm mẫu
          </CButton>
        </CCol>
      </CRow>

      <CCard>
        <CCardHeader>Danh sách mẫu thông báo</CCardHeader>
        <CCardBody>
          <CTable striped hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Tên mẫu</CTableHeaderCell>
                <CTableHeaderCell>Loại</CTableHeaderCell>
                <CTableHeaderCell>Tiêu đề</CTableHeaderCell>
                <CTableHeaderCell>Cập nhật</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {templates.map((t, idx) => (
                <CTableRow key={t.id}>
                  <CTableHeaderCell>{idx + 1}</CTableHeaderCell>
                  <CTableDataCell>{t.name}</CTableDataCell>
                  <CTableDataCell>{t.type}</CTableDataCell>
                  <CTableDataCell>{t.subject}</CTableDataCell>
                  <CTableDataCell>{t.updatedAt}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal thêm mới */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Thêm mẫu thông báo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            className="mb-2"
            label="Tên mẫu"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
          />
          <CFormInput
            className="mb-2"
            label="Loại (Email/SMS/Push)"
            value={newTemplate.type}
            onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
          />
          <CFormInput
            className="mb-2"
            label="Tiêu đề"
            value={newTemplate.subject}
            onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={handleAdd}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default NotificationTemplatesPage;
