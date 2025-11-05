import React, { useState } from "react";
import "../../styles/SignUpForCustomerStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
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

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUpCustomer } = useAuth();
  const navigate = useNavigate();
  
  const validate = () => {
    let newErrors = {};

    if (!form.fullname.trim()) newErrors.fullname = "Bạn chưa nhập tên của mình";
    else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(form.fullname))
      newErrors.fullname = "Tên chỉ được nhập chữ";

    if (!form.role) newErrors.role = "Vui lòng chọn một lựa chọn";

    if (form.role === "Cô dâu" || form.role === "Chú rể") {
      if (!form.partner.trim()) newErrors.partner = "Vui lòng nhập tên người đồng hành";
      else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(form.partner))
        newErrors.partner = "Tên chỉ được nhập chữ";
    }

    if (!/^[0-9]{9,11}$/.test(form.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
    if (!form.email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (form.password.length < 6) newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";
    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await signUpCustomer({
          fullname: form.fullname,
          weddingRole: form.role,
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
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-left">
          <h1>Chào mừng!</h1>
          <p>Hãy đăng ký để trải nghiệm dịch vụ của chúng tôi.</p>
        </div>
        <div className="signup-right">
          <h2>Đăng Ký Khách Hàng</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
                placeholder="Họ và tên"
                value={form.fullname}
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              />
              <div className="invalid-feedback">{errors.fullname}</div>
            </div>

            <div className="form-group">
              <select
                className={`form-control ${errors.role ? "is-invalid" : ""}`}
                value={form.role}
                onChange={(e) => {
                  const role = e.target.value;
                  setForm({ ...form, role, partner: role === "Cô dâu" || role === "Chú rể" ? form.partner : "" });
                }}
              >
                <option value="" disabled hidden> Bạn là? </option>
                <option value="Cô dâu">Cô dâu</option>
                <option value="Chú rể">Chú rể</option>
                <option value="Khác">Khác</option>
              </select>
              <div className="invalid-feedback">{errors.role}</div>
            </div>

            {(form.role === "Cô dâu" || form.role === "Chú rể") && (
              <div className="form-group">
                <input
                  type="text"
                  className={`form-control ${errors.partner ? "is-invalid" : ""}`}
                  placeholder="Nhập tên người đồng hành"
                  value={form.partner}
                  onChange={(e) => setForm({ ...form, partner: e.target.value })}
                />
                <div className="invalid-feedback">{errors.partner}</div>
              </div>
            )}

            <div className="form-group">
              <input
                type="text"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <div className="invalid-feedback">{errors.phone}</div>
            </div>

            <div className="form-group">
              <input
                type="text"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="invalid-feedback">{errors.email}</div>
            </div>

            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <div className="invalid-feedback">{errors.password}</div>
            </div>

            <div className="form-group password-wrapper">
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  autoComplete="new-password"
                />
                <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            </div>
            <button type="submit" className="btn-submit">Đăng Ký</button>
          </form>

          <div className="links">
            <p>Bạn đã có tài khoản? <a href="/login">Đăng nhập</a></p>
            <p>Quay lại <a href="/">Trang chủ</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}