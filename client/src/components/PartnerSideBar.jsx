import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { Home, FileText, Settings, Menu, CheckSquare, DollarSign, Slack, Bell } from "lucide-react";

export default function Sidebar() {
  return (
    <div style={{ width: 260 }} className="bg-white border-end vh-100 position-sticky top-0">
      <div className="p-3">
        <h6 className="mb-3">Partner Hub</h6>
        <Nav className="flex-column">
          <Nav.Link as={NavLink} to="/partner" end><Home size={16} className="me-2"/>Dashboard</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/commission"><FileText size={16} className="me-2"/>Commission</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/profile"><Settings size={16} className="me-2"/>Profile</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/restaurants"><Menu size={16} className="me-2"/>Restaurants</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/bookings"><CheckSquare size={16} className="me-2"/>Bookings</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/payments"><DollarSign size={16} className="me-2"/>Payments</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/reviews"><Slack size={16} className="me-2"/>Reviews</Nav.Link>
          <Nav.Link as={NavLink} to="/partner/notifications"><Bell size={16} className="me-2"/>Notifications</Nav.Link>
        </Nav>
      </div>
    </div>
  );
}