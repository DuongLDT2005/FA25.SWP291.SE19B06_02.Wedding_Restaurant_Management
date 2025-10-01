import React from "react";
import { Container } from "react-bootstrap";
import Sidebar from "../components/PartnerSideBar";
import TopBar from "../components/PartnerTopBar";

export default function PartnerLayout({ children }) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-fill">
        <TopBar />
        <Container fluid className="p-4">
          {children}
        </Container>
      </div>
    </div>
  );
}
