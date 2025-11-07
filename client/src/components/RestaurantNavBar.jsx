import React from "react";
import { Star, Gift, Building, BookOpen, Settings } from "lucide-react";

export default function NavBar() {
  const navItems = [
    { href: "#overview", label: "Tổng quan", icon: null, active: true },
    { href: "#promotions", label: "Ưu đãi", icon: <Gift size={16} className="me-1" /> },
    { href: "#halls", label: "Sảnh tiệc", icon: <Building size={16} className="me-1" /> },
    { href: "#menus", label: "Thực đơn", icon: <BookOpen size={16} className="me-1" /> },
    { href: "#services", label: "Dịch vụ", icon: <Settings size={16} className="me-1" /> },
    { href: "#reviews", label: "Đánh giá", icon: <Star size={16} className="me-1" /> },
  ];

  return (
    <nav className="my-4">
      <ul className="nav nav-pills justify-content-center flex-wrap" style={{ gap: "0.5rem" }}>
        {navItems.map((item) => (
          <li key={item.href} className="nav-item">
            <a
              className={`nav-link d-flex align-items-center px-3 py-2 ${item.active ? "active" : ""}`}
              href={item.href}
              style={{
                borderRadius: "50px",
                transition: "all 0.2s",
                color: item.active ? "#fff" : "#993344",
                backgroundColor: item.active ? "#993344" : "transparent",
                fontWeight: "500",
              }}
            >
              {item.icon}
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}