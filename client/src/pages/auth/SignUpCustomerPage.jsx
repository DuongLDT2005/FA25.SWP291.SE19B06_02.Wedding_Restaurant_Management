import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Form, Button } from "react-bootstrap";
import AuthLayout from "../../layouts/MainLayout";
export default function SignUpCustomer() {
  const [form, setForm] = useState({
    fullname: "",
    role: "",
    partner: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const roleMap = {
    "Cô dâu": 0,
    "Chú rể": 1,
    "Khác": 2,
  };

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUpCustomer } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};

    if (!form.fullname.trim()) e.fullname = "Vui lòng nhập họ tên.";
    else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(form.fullname))
      e.fullname = "Tên không chứa số hoặc kí tự đặc biệt.";

    if (form.role === "Cô dâu" || form.role === "Chú rể") {
      if (!form.partner.trim()) e.partner = "Vui lòng nhập tên người đồng hành";
      else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(form.partner))
        e.partner = "Tên chỉ được nhập chữ";
    }

    if (!/^[0-9]{9,11}$/.test(form.phone))
      e.phone = "Số điện thoại không hợp lệ";
    if (!/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(form.email))
      e.email = "Email không hợp lệ";
    if (!form.password || form.password.length < 6)
      e.password = "Mật khẩu >= 6 ký tự";
    if (form.confirmPassword !== form.password)
      e.confirmPassword = "Mật khẩu nhập lại không khớp";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await signUpCustomer({
          fullname: form.fullname,
          weddingRole: roleMap[form.role],
          partner: form.partner,
          phone: form.phone,
          email: form.email,
          password: form.password,
        });
        // success -> redirect to login
        navigate("/login");
      } catch (err) {
        // show error (backend message or generic)
        alert(err?.message || String(err));
      }
    }
  };

  return (
    <AuthLayout>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fefaf9",
          padding: "20px",
        }}
      >
        <style>{`
          .signup-card {
            display: grid;
            grid-template-columns: 55% 45%;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
            background: white;
          }
          @media (max-width: 768px) {
            .signup-card {
              grid-template-columns: 1fr;
            }
          }
          .toggle-password {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #777;
            pointer-events: auto;
          }
          .password-input-wrapper {
            position: relative;
          }
          .password-input-wrapper input {
            padding-right: 44px;
          }
        `}</style>

        <div
          className="signup-card"
          style={{ maxWidth: "1000px", width: "100%" }}
        >
          <div
            style={{
              backgroundColor: "#E11D48",
              color: "#fefaf9",
              padding: "200px 100px 0px 40px",
              borderTopLeftRadius: "15px",
              borderBottomLeftRadius: "15px",
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
              Câu chuyện tình cảm của bạn xứng đáng được ghi khắc lại. Hãy để
              chúng tôi giúp bạn biến ngày trọng đại của bạn thành một kỷ niệm
              không thể nào quên.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#fff",
              padding: "40px",
              borderTopRightRadius: "15px",
              borderBottomRightRadius: "15px",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                fontSize: "32px",
                textAlign: "center",
                color: "#E11D48",
                fontWeight: "700",
              }}
            >
              Đăng Ký Khách Hàng
            </h2>
            <form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Họ và tên"
                  value={form.fullname}
                  onChange={(e) =>
                    setForm({ ...form, fullname: e.target.value })
                  }
                  isInvalid={!!errors.fullname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullname}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Select
                  value={form.role}
                  onChange={(e) => {
                    const role = e.target.value;
                    setForm({
                      ...form,
                      role,
                      partner:
                        role === "Cô dâu" || role === "Chú rể"
                          ? form.partner
                          : "",
                    });
                  }}
                  isInvalid={!!errors.role}
                >
                  <option value="" disabled hidden>
                    Bạn là?
                  </option>
                  <option value="Cô dâu">Cô dâu</option>
                  <option value="Chú rể">Chú rể</option>
                  <option value="Khác">Khác</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.role}
                </Form.Control.Feedback>
              </Form.Group>

              {(form.role === "Cô dâu" || form.role === "Chú rể") && (
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên người đồng hành"
                    value={form.partner}
                    onChange={(e) =>
                      setForm({ ...form, partner: e.target.value })
                    }
                    isInvalid={!!errors.partner}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.partner}
                  </Form.Control.Feedback>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="password-input-wrapper">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    isInvalid={!!errors.password}
                    autoComplete="new-password"
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: errors.password ? "block" : "none" }}
                >
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="password-input-wrapper">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    isInvalid={!!errors.confirmPassword}
                    autoComplete="new-password"
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </span>
                </div>
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: errors.confirmPassword ? "block" : "none" }}
                >
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#E11D48",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "15px",
                  fontWeight: "600",
                  marginBottom: "20px",
                }}
              >
                Đăng Ký
              </Button>
            </form>

            <div
              style={{ textAlign: "center", fontSize: "14px", color: "#999" }}
            >
              <p>
                Bạn đã có tài khoản?{" "}
                <a
                  href="/"
                  style={{
                    color: "#f6a401",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Đăng nhập
                </a>
              </p>
              <p>
                Quay lại{" "}
                <a
                  href="/"
                  style={{
                    color: "#f6a401",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Trang chủ
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
