import React from "react";
import { Navbar, Nav, Container, Badge, NavDropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

export default function TopBar() {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Nav className="ms-auto align-items-center">

          {/* Thông báo */}
          <Nav.Link as={Link} to="/partner/notifications" className="me-3">
            <Bell size={18} /> <Badge bg="danger">3</Badge>
          </Nav.Link>

          {/* Dropdown Profile */}
          <NavDropdown
            align="end"
            title={
              <span>
                <span className="d-none d-sm-inline">Nguyễn Văn A</span>
              </span>
            }
            id="profile-dropdown"
          >
            <NavDropdown.Item>Tài khoản</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/partner/profile">Hồ sơ</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to="/logout">Đăng xuất</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
