import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import AppHeaderDropdown from "./AppHeaderDropdown";

// 🧪 Mock Notifications
const mockNotifications = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  title: `Thông báo #${i + 1}`,
  content: `Nội dung chi tiết của thông báo số ${i + 1}`,
  time: `${i + 1} phút trước`,
  read: i % 3 === 0, // Một vài cái đã đọc
}));

const NOTIFICATIONS_PER_PAGE = 5;

const NotificationDropdown = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(mockNotifications.length / NOTIFICATIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * NOTIFICATIONS_PER_PAGE;
  const currentNotifications = mockNotifications.slice(
    startIndex,
    startIndex + NOTIFICATIONS_PER_PAGE
  );

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <CDropdown variant="nav-item" alignment="end">
      {/* remove default padding, and use a relative wrapper for precise positioning */}
      <CDropdownToggle
        caret={false}
        className="py-0 px-1"
        style={{ cursor: "pointer", background: "transparent", border: "none" }}
      >
        <span
          className="position-relative d-inline-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36 }}
        >
          <CIcon icon={cilBell} size="lg" />
          {unreadCount > 0 && (
            // dot: small red circle with white border so it stands out on dark bg
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 6,
                width: 10,
                height: 10,
                backgroundColor: "#ff3b30",
                borderRadius: "50%",
                border: "2px solid #fff",
                boxSizing: "content-box",
                zIndex: 5,
              }}
            />
          )}
        </span>
      </CDropdownToggle>

      <CDropdownMenu style={{ width: 320, maxHeight: 400, overflowY: "auto" }}>
        <div className="px-3 py-2 border-bottom fw-bold">🔔 Thông báo</div>

        {currentNotifications.length > 0 ? (
          currentNotifications.map((noti) => (
            <CDropdownItem
              key={noti.id}
              className="py-2"
              style={{ whiteSpace: "normal" }}
            >
              <div className="fw-bold">{noti.title}</div>
              <div className="small text-muted">{noti.content}</div>
              <div className="small text-end text-secondary">{noti.time}</div>
            </CDropdownItem>
          ))
        ) : (
          <CDropdownItem disabled className="text-center">
            Không có thông báo
          </CDropdownItem>
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-between px-3 py-2 border-top">
            <button
              className="btn btn-sm btn-light"
              disabled={currentPage === 1}
              onClick={handlePrev}
            >
              ← Trước
            </button>
            <span className="small">
              Trang {currentPage}/{totalPages}
            </span>
            <button
              className="btn btn-sm btn-light"
              disabled={currentPage === totalPages}
              onClick={handleNext}
            >
              Tiếp →
            </button>
          </div>
        )}
      </CDropdownMenu>
    </CDropdown>
  );
};

const AppHeader = () => {
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme"
  );

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          "shadow-sm",
          document.documentElement.scrollTop > 0
        );
    });
  }, []);

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: "-14px" }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/admin/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/admin/users" as={NavLink}>
            Users
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        {/* 🔔 Dropdown Thông báo */}
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <NotificationDropdown />
          </CNavItem>

          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === "dark" ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === "auto" ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === "light"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("light")}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "dark"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("dark")}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "auto"}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode("auto")}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
