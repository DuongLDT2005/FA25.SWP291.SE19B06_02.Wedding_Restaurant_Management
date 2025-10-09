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
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from "@coreui/react";

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      code: "WEDDING20",
      name: "Giảm 20% tiệc cưới",
      description: "Áp dụng cho tất cả các nhà hàng trong tháng 10",
      discount: 20,
      startDate: "2025-10-01",
      endDate: "2025-10-31",
      status: "Active",
    },
    {
      id: 2,
      code: "HAPPYHOUR",
      name: "Giờ vàng giảm 10%",
      description: "Từ 14h - 17h hàng ngày",
      discount: 10,
      startDate: "2025-09-15",
      endDate: "2025-12-31",
      status: "Inactive",
    },
  ]);

  const [newPromotion, setNewPromotion] = useState({
    code: "",
    name: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, color = "success") => {
    setToast(
      <CToast color={color} autohide visible>
        <CToastHeader closeButton>System</CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPromotion = (e) => {
    e.preventDefault();
    if (!newPromotion.code || !newPromotion.name || !newPromotion.discount) {
      showToast("Vui lòng nhập đầy đủ thông tin", "danger");
      return;
    }

    const newItem = {
      id: promotions.length + 1,
      ...newPromotion,
      discount: Number(newPromotion.discount),
      status: "Active",
    };

    setPromotions((prev) => [...prev, newItem]);
    setNewPromotion({
      code: "",
      name: "",
      description: "",
      discount: "",
      startDate: "",
      endDate: "",
    });
    showToast(`Thêm khuyến mãi "${newItem.name}" thành công`);
  };

  const handleStatusChange = (id, newStatus) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    showToast(`Cập nhật trạng thái promotion #${id} thành "${newStatus}"`);
  };

  const handleDelete = (id) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    showToast(`Xóa promotion #${id}`, "danger");
  };

  // 🟡 Hàm format ngày từ yyyy-mm-dd → dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <CToaster placement="top-end">{toast}</CToaster>

      {/* Form thêm khuyến mãi */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Thêm chương trình khuyến mãi</strong>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleAddPromotion}>
            <CRow className="g-3">
              <CCol md={2}>
                <CFormInput
                  name="code"
                  label="Mã khuyến mãi"
                  value={newPromotion.code}
                  onChange={handleInputChange}
                  placeholder="VD: SUMMER50"
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  name="name"
                  label="Tên chương trình"
                  value={newPromotion.name}
                  onChange={handleInputChange}
                  placeholder="VD: Giảm mùa hè"
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  type="number"
                  name="discount"
                  label="Giảm (%)"
                  value={newPromotion.discount}
                  onChange={handleInputChange}
                  placeholder="20"
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  type="date"
                  name="startDate"
                  label="Bắt đầu"
                  value={newPromotion.startDate}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  type="date"
                  name="endDate"
                  label="Kết thúc"
                  value={newPromotion.endDate}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={1} className="d-flex align-items-end">
                <CButton color="primary" type="submit">
                  Thêm
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Danh sách khuyến mãi */}
      <CCard>
        <CCardHeader>
          <strong>Danh sách khuyến mãi</strong>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Mã</CTableHeaderCell>
                <CTableHeaderCell>Tên chương trình</CTableHeaderCell>
                <CTableHeaderCell>Giảm (%)</CTableHeaderCell>
                <CTableHeaderCell>Thời gian</CTableHeaderCell>
                <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                <CTableHeaderCell>Hành động</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {promotions.map((p) => (
                <CTableRow key={p.id}>
                  <CTableHeaderCell>{p.id}</CTableHeaderCell>
                  <CTableDataCell>{p.code}</CTableDataCell>
                  <CTableDataCell>
                    <div>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: "0.85em", color: "#666" }}>{p.description}</div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{p.discount}%</CTableDataCell>
                  <CTableDataCell>
                    {formatDate(p.startDate)} → {formatDate(p.endDate)}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormSelect
                      size="sm"
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(p.id)}
                    >
                      Xóa
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

export default PromotionsPage;
