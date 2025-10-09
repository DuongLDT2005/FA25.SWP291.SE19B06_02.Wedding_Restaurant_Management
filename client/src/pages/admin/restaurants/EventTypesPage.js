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
} from "@coreui/react";

const EventTypesPage = () => {
  const [eventTypes] = useState([
    { id: 1, name: "Tiệc cưới" },
    { id: 2, name: "Hội nghị" },
    { id: 3, name: "Sinh nhật" },
    { id: 4, name: "Team building" },
  ]);

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Event Types Management</strong>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Event Type Name</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {eventTypes.map((e) => (
              <CTableRow key={e.id}>
                <CTableHeaderCell>{e.id}</CTableHeaderCell>
                <CTableDataCell>{e.name}</CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" color="warning" variant="outline">
                    Edit
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
