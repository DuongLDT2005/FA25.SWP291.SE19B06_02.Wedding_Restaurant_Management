import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { Home, FileText, Settings, Menu, CheckSquare, DollarSign, Slack, Bell } from "lucide-react";

export default function Sidebar() {
  return (
    <div style={{ width: 250 }} className="bg-white border-end vh-100 position-sticky top-0">
      <div className="p-3">
        <Nav className="flex-column">
          <Nav.Link as={NavLink} to="/partner" end><Home size={16} className="me-2" />Bảng điều khiển</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/profile"><Settings size={16} className="me-2" />Hồ sơ</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/restaurants"><Menu size={16} className="me-2" />Nhà hàng</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/bookings"><CheckSquare size={16} className="me-2" />Đặt tiệc</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/payments"><DollarSign size={16} className="me-2" />Thanh toán</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/reviews"><Slack size={16} className="me-2" />Đánh giá</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/notifications"><Bell size={16} className="me-2" />Thông báo</Nav.Link>
        </Nav>
      </div>
    </div>
  );
}