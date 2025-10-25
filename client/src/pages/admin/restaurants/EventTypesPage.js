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
  CFormInput,
  CRow,
  CCol,
} from "@coreui/react";

const EventTypesPage = () => {
  const [eventTypes, setEventTypes] = useState([
    { id: 1, name: "Tiệc cưới" },
    { id: 2, name: "Hội nghị" },
    { id: 3, name: "Sinh nhật" },
    { id: 4, name: "Team building" },
  ]);

  const [search, setSearch] = useState("");
  const [newEventType, setNewEventType] = useState("");

  const handleAddEventType = () => {
    if (!newEventType.trim()) return;
    const newItem = {
      id: eventTypes.length ? eventTypes[eventTypes.length - 1].id + 1 : 1,
      name: newEventType,
    };
    setEventTypes((prev) => [...prev, newItem]);
    setNewEventType("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa loại sự kiện này không?")) {
      setEventTypes((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const filteredEventTypes = eventTypes.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Event Types Management</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              placeholder="Tìm kiếm loại sự kiện..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CCol>
          <CCol md={4}>
            <CFormInput
              placeholder="Tên loại sự kiện mới..."
              value={newEventType}
              onChange={(e) => setNewEventType(e.target.value)}
            />
          </CCol>
          <CCol md={2}>
            <CButton color="primary" onClick={handleAddEventType} className="w-100">
              Thêm mới
            </CButton>
          </CCol>
        </CRow>

        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Event Type Name</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredEventTypes.map((e) => (
              <CTableRow key={e.id}>
                <CTableHeaderCell>{e.id}</CTableHeaderCell>
                <CTableDataCell>{e.name}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="danger"
                    variant="outline"
                    onClick={() => handleDelete(e.id)}
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

export default EventTypesPage;
