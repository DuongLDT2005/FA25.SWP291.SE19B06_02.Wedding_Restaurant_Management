import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/LoginStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
/* global google */

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import AuthLayout from "../../layouts/MainLayout";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [forgotGlobalError, setForgotGlobalError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotEmailError, setForgotEmailError] = useState("");

  const { login, forgotPassword } = useAuth();

  const navigate = useNavigate();

  const emailIsValid = (e) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.trim());

  // ==========================================================
  // 💬 Xử lý đăng nhập truyền thống
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setInfo("");

    let valid = true;
    if (!emailIsValid(email)) {
      setEmailError("Vui lòng nhập email hợp lệ.");
      valid = false;
    }
    if (!password || password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      valid = false;
    }
    if (!valid) return;

    setLoading(true);

    try {
      const data = await login({ email, password });
      setInfo("Đăng nhập thành công — điều hướng...");

      // Điều hướng theo vai trò
      if (data.role === "ADMIN") navigate("/admin/dashboard");
      else if (data.role === "RESTAURANT_PARTNER") navigate("/partner");
      else navigate("/");
    } catch (err) {
      setGlobalError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // 💬 Quên mật khẩu
  // ==========================================================
  const handleForgot = async (ev) => {
    ev.preventDefault();
    setForgotEmailError("");
    setForgotGlobalError("");

    if (!emailIsValid(forgotEmail)) {
      setForgotEmailError("Email không hợp lệ");
      return;
    }

    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail);
      setInfo("Nếu email tồn tại, hệ thống đã gửi hướng dẫn đặt lại mật khẩu.");
      setShowForgot(false);
      setForgotEmail("");
    } catch (err) {
      setForgotGlobalError(err.message || "Không thể gửi email khôi phục");
    } finally {
      setForgotLoading(false);
    }
  };

  // ==========================================================
  // 💬 Đăng nhập bằng Google Popup
  // ==========================================================
  const handleGoogleLogin = () => {
    try {
      const client = google.accounts.oauth2.initCodeClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: "email profile openid",
        ux_mode: "popup",
        callback: async (response) => {
          // 🧩 Nếu user hủy popup hoặc không có mã code
          if (!response.code) {
            console.log(
              "Người dùng đã hủy đăng nhập Google hoặc popup bị đóng."
            );
            toast.info("Đăng nhập Google đã bị hủy.");
            return;
          }

          try {
            const res = await axios.post(
              "http://localhost:5000/api/auth/google",
              { code: response.code },
              { headers: { "Content-Type": "application/json" } }
            );

            console.log("✅ Google login success:", res.data);
            toast.success("Đăng nhập Google thành công!");

            // Cookie HttpOnly đã được set ở response; chỉ cần điều hướng theo role int
            const role = res.data?.user?.role;
            switch (role) {
              case 2:
                navigate('/admin/dashboard');
                break;
              case 1:
                navigate('/partner');
                break;
              default:
                navigate('/customer/bookings');
            }
          } catch (error) {
            console.error("Google login API error:", error);
            toast.error("Đăng nhập Google thất bại. Vui lòng thử lại!");
          }
        },
      });

      client.requestCode();
    } catch (err) {
      console.warn("Google popup bị đóng:", err.message);
      toast.info("Bạn đã đóng cửa sổ đăng nhập Google.");
    }
  };

  // ==========================================================
  // 💬 Render giao diện
  // ==========================================================
  return (
    <AuthLayout>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <Container
          fluid
          style={{
            maxWidth: "1200px",
            paddingLeft: "60px",
            paddingRight: "60px",
          }}
        >
          <Row
            style={{
              minHeight: "500px",
              boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
              overflow: "hidden",
            }}
          >
            {/* Màu hồng bên trái */}
            <Col
              md={7}
              style={{
                backgroundColor: "#E11D48",
                color: "#fefaf9",
                padding: "50px 40px 40px 40px",
              }}
            >
              <h1
                style={{
                  fontSize: "50px",
                  marginBottom: "10px",
                  fontWeight: "700",
                }}
              >
                Chào mừng!
              </h1>
              <p style={{ fontSize: "18px", margin: "0", lineHeight: "1.5" }}>
                Đăng nhập để tiếp tục đặt tiệc và khám phá ưu đãi tại
                LifEvent.com.
              </p>
            </Col>

            {/* Form đăng nhập */}
            <Col md={5} style={{ backgroundColor: "#fff", padding: "40px" }}>
              <h1
                style={{
                  marginBottom: "20px",
                  fontSize: "32px",
                  textAlign: "center",
                  color: "#E11D48",
                  fontWeight: "700",
                }}
              >
                Đăng Nhập
              </h1>

              {globalError && (
                <Alert
                  variant="danger"
                  style={{ marginBottom: "12px", fontSize: "14px" }}
                >
                  {globalError}
                </Alert>
              )}
              {info && (
                <Alert
                  variant="success"
                  style={{ marginBottom: "12px", fontSize: "14px" }}
                >
                  {info}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    name="email"
                    type="email"
                    value={email}
                    isInvalid={!!emailError}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                  {emailError && (
                    <Form.Control.Feedback type="invalid">
                      {emailError}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group className="mb-2">
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      isInvalid={!!passwordError}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu"
                    />
                    {!passwordError && (
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "12px",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#777",
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </span>
                    )}
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {passwordError}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="text-end mb-3">
                  <Button
                    variant="link"
                    style={{
                      color: "#E11D48",
                      fontSize: "13px",
                      padding: "0",
                      textDecoration: "none",
                    }}
                    onClick={() => setShowForgot(true)}
                  >
                    Quên mật khẩu?
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: "#E11D48",
                    borderColor: "#dc3257ff",
                    width: "100%",
                    marginBottom: "16px",
                    color: "#fff",
                  }}
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
              </Form>

              {/* Google login */}
              <div
                style={{
                  textAlign: "center",
                  margin: "16px 0",
                  fontSize: "13px",
                  color: "#999",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    zIndex: "1",
                    backgroundColor: "#fff",
                    padding: "0 8px",
                  }}
                >
                  Hoặc đăng nhập với
                </span>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    right: "0",
                    height: "1px",
                    backgroundColor: "#ddd",
                    zIndex: "0",
                  }}
                ></div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
              >
                <Button
                  onClick={handleGoogleLogin}
                  style={{
                    width: "45px",
                    height: "45px",
                    padding: "0",
                    borderRadius: "50%",
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.border = "1px solid #E11D48";
                    e.target.style.boxShadow =
                      "0px 0px 6px rgba(225, 29, 72, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.border = "1px solid #ddd";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google logo"
                    style={{
                      width: "24px",
                      height: "24px",
                      pointerEvents: "none",
                    }}
                  />
                </Button>
              </div>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  marginTop: "10px",
                  color: "rgb(51, 17, 17)",
                }}
              >
                Bạn mới đặt tiệc lần đầu?{" "}
                <a
                  href="/signup/customer"
                  style={{
                    color: "#f6a401",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Tham gia ngay
                </a>
              </p>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "rgb(51, 17, 17)",
                }}
              >
                Bạn là đối tác nhà hàng mới muốn hợp tác?{" "}
                <a
                  href="/signup/partner"
                  style={{
                    color: "#f6a401",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Đăng ký ngay
                </a>
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal Quên mật khẩu */}
      <Modal show={showForgot} onHide={() => setShowForgot(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Đặt lại mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: "14px", marginBottom: "12px" }}>
            Nhập email để nhận đường dẫn đặt lại mật khẩu.
          </p>
          {forgotGlobalError && (
            <Alert
              variant="danger"
              style={{ marginBottom: "12px", fontSize: "14px" }}
            >
              {forgotGlobalError}
            </Alert>
          )}
          {forgotEmailError && (
            <Alert
              variant="danger"
              style={{ marginBottom: "12px", fontSize: "14px" }}
            >
              {forgotEmailError}
            </Alert>
          )}
          <Form onSubmit={handleForgot}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </Form.Group>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button variant="secondary" onClick={() => setShowForgot(false)}>
                Hủy
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: "#E11D48", borderColor: "#dd4666ff" }}
                disabled={forgotLoading}
              >
                {forgotLoading ? "Đang gửi..." : "Gửi"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </AuthLayout>
  );
}
