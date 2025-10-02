import React from "react";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Bell, Users } from "lucide-react";
import mock from "../mock/partnerMock";

export default function TopBar() {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/partner">{mock.partner.name}</Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          <Nav.Link as={Link} to="/partner/notifications">
            <Bell /> <Badge bg="danger">3</Badge>
          </Nav.Link>
          <Nav.Link as={Link} to="/partner/profile"><Users /> Profile</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}