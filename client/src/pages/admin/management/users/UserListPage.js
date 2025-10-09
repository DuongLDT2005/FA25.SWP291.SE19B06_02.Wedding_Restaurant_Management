import React from "react";
import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from "@coreui/react";

const UserList = () => {
  const users = [
    { id: 1, name: "Nguyễn Văn A", role: "Customer" },
    { id: 2, name: "Trần Thị B", role: "Partner" },
    { id: 3, name: "Admin C", role: "Admin" },
  ];

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>User Management</strong>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Role</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {users.map((u) => (
              <CTableRow key={u.id}>
                <CTableHeaderCell>{u.id}</CTableHeaderCell>
                <CTableDataCell>{u.name}</CTableDataCell>
                <CTableDataCell>{u.role}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default UserList;
