import { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import NotificationDropdown from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";
// import useAuth from "../../hooks/useAuth";
import "../../styles/HeaderStyles.css";

export default function Header() {
  // const { user, handleLogout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(y > 120);
    };

    handleScroll(); // đảm bảo trạng thái khi reload
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const notifications = [
    {
      id: 1,
      type: "chat",
      title: "Tin nhắn mới",
      preview: "Nhà hàng Golden: Chúng tôi đã nhận được yêu cầu...",
      time: "2 phút trước",
      unread: true,
    },
    {
      id: 2,
      type: "promo",
      title: "Khuyến mãi tháng 10",
      preview: "Giảm 15% cho tiệc cưới đặt trước 30 ngày.",
      time: "1 giờ trước",
      unread: true,
    },
    {
      id: 3,
      type: "chat",
      title: "Trao đổi",
      preview: "Nhà hàng Silver hỏi thêm thông tin về số bàn.",
      time: "Hôm qua",
      unread: false,
    },
  ];

  return (
    <Navbar
      expand="md"
      fixed="top"
      className="py-2 bg-white shadow-sm" // Luôn có nền trắng
      style={{
        zIndex: 999,
        transition: "all 0.3s ease",
      }}
    >
      <Container fluid style={{ padding: "0 50px", maxWidth: "1200px" }}>
        {/* Logo */}
        <Navbar.Brand
          href="/"
          className="fw-bold fs-3"
          style={{
            letterSpacing: "0.5px",
            color: "#E11D48", // Màu chữ LifEvent cố định
          }}
        >
          LifEvent
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center gap-3">
          {/* 🔸 Hiển thị các nút mặc định */}
          <Button
            variant="link"
            className="fw-medium px-3 text-decoration-none text-dark"
          >
            Bạn Muốn Hợp Tác?
          </Button>
          <Button
            variant="outline-dark"
            className="fw-medium px-3 rounded header-link-btn"
            href="/signup"
          >
            Đăng Ký
          </Button>
          <Button
            variant="danger"
            className="px-3 rounded fw-medium shadow-sm text-white header-cta"
            style={{
              backgroundColor: "#E11D48",
              borderColor: "#E11D48",
            }}
            href="/login"
          >
            Đăng Nhập
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
