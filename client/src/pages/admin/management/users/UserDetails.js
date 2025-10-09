import React from "react";
import { CListGroup, CListGroupItem } from "@coreui/react";

const UserDetail = ({ user }) => {
  return (
    <CListGroup flush>
      <CListGroupItem><strong>ID:</strong> {user.id}</CListGroupItem>
      <CListGroupItem><strong>Name:</strong> {user.name}</CListGroupItem>
      <CListGroupItem><strong>Role:</strong> {user.role}</CListGroupItem>
      <CListGroupItem><strong>Email:</strong> {user.email}</CListGroupItem>
      <CListGroupItem><strong>Phone:</strong> {user.phone}</CListGroupItem>
      <CListGroupItem><strong>Created At:</strong> {user.createdAt}</CListGroupItem>
      <CListGroupItem><strong>Status:</strong> {user.active ? "Active" : "Inactive"}</CListGroupItem>
    </CListGroup>
  );
};

export default UserDetail;
