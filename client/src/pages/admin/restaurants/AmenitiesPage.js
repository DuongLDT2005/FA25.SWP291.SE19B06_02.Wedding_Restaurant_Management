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
} from "@coreui/react";

const AmenitiesPage = () => {
  const [amenities, setAmenities] = useState([
    { id: 1, name: "Wifi miễn phí", active: true },
    { id: 2, name: "Bãi giữ xe", active: true },
    { id: 3, name: "Trang trí decor", active: false },
    { id: 4, name: "Âm thanh ánh sáng", active: true },
  ]);

  const toggleActive = (id) => {
    setAmenities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Amenities Management</strong>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Amenity</CTableHeaderCell>
              <CTableHeaderCell>Active</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {amenities.map((a) => (
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
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default AmenitiesPage;
