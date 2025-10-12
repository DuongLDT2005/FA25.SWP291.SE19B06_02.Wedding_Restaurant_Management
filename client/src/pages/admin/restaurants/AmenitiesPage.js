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
  CFormSwitch,
  CFormInput,
  CButton,
  CRow,
  CCol,
} from "@coreui/react";

const AmenitiesPage = () => {
  const [amenities, setAmenities] = useState([
    { id: 1, name: "Wifi miễn phí", active: true },
    { id: 2, name: "Bãi giữ xe", active: true },
    { id: 3, name: "Trang trí decor", active: false },
    { id: 4, name: "Âm thanh ánh sáng", active: true },
  ]);

  const [search, setSearch] = useState("");
  const [newAmenity, setNewAmenity] = useState("");

  const toggleActive = (id) => {
    setAmenities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    const newItem = {
      id: amenities.length ? amenities[amenities.length - 1].id + 1 : 1,
      name: newAmenity,
      active: true,
    };
    setAmenities((prev) => [...prev, newItem]);
    setNewAmenity("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tiện ích này không?")) {
      setAmenities((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredAmenities = amenities.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Amenities Management</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              placeholder="Tìm kiếm amenity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CCol>
          <CCol md={4}>
            <CFormInput
              placeholder="Tên tiện ích mới..."
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
            />
          </CCol>
          <CCol md={2}>
            <CButton color="primary" onClick={handleAddAmenity} className="w-100">
              Thêm mới
            </CButton>
          </CCol>
        </CRow>

        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Amenity</CTableHeaderCell>
              <CTableHeaderCell>Active</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredAmenities.map((a) => (
              <CTableRow key={a.id}>
                <CTableHeaderCell>{a.id}</CTableHeaderCell>
                <CTableDataCell>{a.name}</CTableDataCell>
                <CTableDataCell>
                  <CFormSwitch
                    color="success"
                    checked={a.active}
                    onChange={() => toggleActive(a.id)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="danger"
                    variant="outline"
                    onClick={() => handleDelete(a.id)}
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
  );
};

export default AmenitiesPage;
