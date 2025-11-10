import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Nav,
  Button,
  Collapse,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  LayoutDashboard,
  Store,
  CreditCard,
  FileText,
  BarChart3,
  Bell,
  Menu as MenuIcon,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function AdminSideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div
      className="sticky-sidebar bg-white border-end vh-100 d-flex flex-column top-0"
      style={{
        width: collapsed ? 70 : 220,
        transition: "width 0.3s",
        minWidth: collapsed ? 70 : 220,
        maxWidth: collapsed ? 70 : 220,
      }}
    >
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-between p-3 border-bottom"
        style={{ height: 60 }}
      >
        {!collapsed && (
          <NavLink to="/admin" className="text-decoration-none">
            <span className="fw-bold fs-5 text-primary">LifEvent Admin</span>
          </NavLink>
        )}
        <Button
          variant="light"
          size="sm"
          className="border-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          <MenuIcon size={18} />
        </Button>
      </div>

      <div className="flex-grow-1 overflow-auto p-2">
        <Nav className="flex-column">
          <SidebarItem
            to="/admin"
            label="Bảng điều khiển"
            icon={<LayoutDashboard size={18} />}
            collapsed={collapsed}
          />

          <SidebarGroup
            label="Quản lý người dùng"
            icon={<Store size={18} />}
            collapsed={collapsed}
            open={openMenus.users}
            toggle={() => toggleMenu("users")}
            items={[
              { to: "/admin/users", label: "Danh sách người dùng" },
              { to: "/admin/license", label: "Xem bản quyền" },
            ]}
          />

          <SidebarItem
            to="/admin/restaurants"
            label="Danh sách các nhà hàng"
            icon={<LayoutDashboard size={18} />}
            collapsed={collapsed}
          />

          <SidebarItem
            to="/admin/bookings"
            label="Quản lý đặt tiệc"
            icon={<FileText size={18} />}
            collapsed={collapsed}
          />

          <SidebarItem
            to="/admin/payments"
            label="Quản lý thanh toán"
            icon={<CreditCard size={18} />}
            collapsed={collapsed}
          />

          <SidebarGroup
            label="Đánh giá & Báo cáo"
            icon={<BarChart3 size={18} />}
            collapsed={collapsed}
            open={openMenus.reports}
            toggle={() => toggleMenu("reports")}
            items={[
              { to: "/admin/reviews", label: "Đánh giá" },
              { to: "/admin/reports", label: "Báo cáo" },
            ]}
          />

          <SidebarItem
            to="/admin/notifications"
            label="Thông báo"
            icon={<Bell size={18} />}
            collapsed={collapsed}
          />

          <SidebarItem
            to="/admin/settings"
            label="Cài đặt"
            icon={<Settings size={18} />}
            collapsed={collapsed}
          />
        </Nav>
      </div>
    </div>
  );
}

/* --- COMPONENT ITEM CƠ BẢN --- */
function SidebarItem({ to, label, icon, collapsed }) {
  return (
    <OverlayTrigger
      placement="right"
      overlay={
        collapsed ? <Tooltip id={`tooltip-${label}`}>{label}</Tooltip> : <></>
      }
    >
      <Nav.Link
        as={NavLink}
        to={to}
        end
        className={({ isActive }) =>
          `d-flex align-items-center rounded-3 mb-2 ${
            isActive ? "bg-primary text-white" : "text-dark"
          }`
        }
        style={{
          display: "flex",
          gap: 15,
          fontSize: 15,
          minHeight: 45,
          padding: "8px 18px",
          transition: "all 0.2s ease",
        }}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </Nav.Link>
    </OverlayTrigger>
  );
}

/* --- COMPONENT GROUP (MENU CÓ CON) --- */
function SidebarGroup({ label, icon, collapsed, open, toggle, items }) {
  const [hover, setHover] = useState(false);

  return (
    <div>
      <button
        onClick={toggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`w-100 border-0 text-start d-flex align-items-center rounded-3 mb-2 ${
          open || hover ? "bg-primary text-white" : "text-primary"
        }`}
        style={{
          display: "flex",
          gap: 15,
          fontSize: 15,
          minHeight: 45,
          padding: "8px 18px",
          width: "100%",
          background: open || hover ? "#0d6efd" : "transparent", // màu xanh đồng nhất
          transition: "all 0.2s ease",
          boxShadow: "none", // xoá viền shadow focus
          outline: "none",   // xoá outline mặc định
        }}
      >
        {icon}
        {!collapsed && (
          <>
            <span className="flex-grow-1">{label}</span>
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </>
        )}
      </button>

      <Collapse in={open && !collapsed}>
        <div className="ms-4">
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `d-block rounded-3 py-2 ps-3 mb-1 text-decoration-none ${
                  isActive ? "text-primary fw-semibold" : "text-secondary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </Collapse>
    </div>
  );
}
