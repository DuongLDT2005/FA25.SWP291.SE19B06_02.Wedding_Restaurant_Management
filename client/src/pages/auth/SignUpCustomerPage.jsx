import { useState } from "react";
import "../../styles/SignUpForCustomerStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function SignUpCus() {
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

  const validate = () => {
    let newErrors = {};

    // Họ và tên
    if (!/^[A-Za-zÀ-ỹ\s]+$/.test(form.fullname)) {
      newErrors.fullname = "Bạn chưa nhập tên của mình";
    }

    // Bạn là?
    if (!form.role) {
      newErrors.role = "Vui lòng chọn một lựa chọn";
    }

    // Người đồng hành (bắt buộc nếu là Cô dâu hoặc Chú rể)
    if (form.role === "Cô dâu" || form.role === "Chú rể") {
      if (!form.partner.trim()) {
        newErrors.partner = "Vui lòng nhập tên người đồng hành";
      } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(form.partner)) {
        newErrors.partner = "Tên chỉ được nhập chữ";
      }
    } else {
      // Nếu chọn Khác thì reset luôn partner để không lưu rác
      form.partner = "";
    }

    // SĐT
    if (!/^[0-9]{9,11}$/.test(form.phone)) {
      newErrors.phone = "Bạn chưa nhập số điện thoại";
    }

    // Email
    if (!form.email.includes("@")) {
      newErrors.email = "Email không hợp lệ";
    }

    // Password
    if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";
    }

    // Confirm Password
    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Đăng ký thành công!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Bên trái */}
        <div className="signup-left">
          <h1>Chào mừng!</h1>
          <p>Hãy đăng ký để trải nghiệm dịch vụ của chúng tôi.</p>
        </div>

        {/* Bên phải */}
        <div className="signup-right">
          <h2>Đăng Ký Khách Hàng</h2>

          <form onSubmit={handleSubmit}>
            {/* Họ và tên */}
            <div className="form-group">
              <input
                type="text"
                placeholder="Họ và tên"
                value={form.fullname}
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const formEl = e.target.form;
                    const index = Array.prototype.indexOf.call(formEl, e.target);
                    formEl.elements[index + 1]?.focus();
                  }
                }}
              />
              {errors.fullname && (
                <div className="invalid-feedback">{errors.fullname}</div>
              )}
            </div>

            {/* Bạn là */}
            <div className="form-group">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const formEl = e.target.form;
                    const index = Array.prototype.indexOf.call(formEl, e.target);
                    formEl.elements[index + 1]?.focus();
                  }
                }}
              >
                <option value="" disabled hidden>
                  Bạn là?
                </option>
                <option value="Cô dâu">Cô dâu</option>
                <option value="Chú rể">Chú rể</option>
                <option value="Khác">Khác</option>
              </select>
              {errors.role && (
                <div className="invalid-feedback">{errors.role}</div>
              )}
            </div>

            {/* Người đồng hành */}
            <div className="form-group">
              <input
                type="text"
                name="partner"
                value={form.partner}
                onChange={(e) => setForm({ ...form, partner: e.target.value })}
                disabled={form.role === "Khác"}
                placeholder="Nhập tên người đồng hành"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const formEl = e.target.form;
                    const index = Array.prototype.indexOf.call(formEl, e.target);
                    formEl.elements[index + 1]?.focus();
                  }
                }}
              />
              {errors.partner && (
                <div className="invalid-feedback">{errors.partner}</div>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="form-group">
              <input
                type="text"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const formEl = e.target.form;
                    const index = Array.prototype.indexOf.call(formEl, e.target);
                    formEl.elements[index + 1]?.focus();
                  }
                }}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>

            {/* Email */}
            <div className="form-group email-group">
              <input
                type="text"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const formEl = e.target.form;
                    const index = Array.prototype.indexOf.call(formEl, e.target);
                    formEl.elements[index + 1]?.focus();
                  }
                }}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const formEl = e.target.form;
                      const index = Array.prototype.indexOf.call(formEl, e.target);
                      formEl.elements[index + 1]?.focus();
                    }
                  }}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            {/* Nhập lại mật khẩu */}
            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const formEl = e.target.form;
                      const index = Array.prototype.indexOf.call(formEl, e.target);
                      formEl.elements[index + 1]?.focus();
                    }
                  }}
                />
                <span
                  className="toggle-password"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </span>
              </div>
              {errors.confirmPassword && (
                <div className="invalid-feedback">
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Nút đăng ký */}
            <button type="submit" className="btn-submit">
              Đăng Ký
            </button>
          </form>

          {/* Liên kết dưới */}
          <div className="links">
            <p>
              Bạn đã có tài khoản? <a href="#">Đăng nhập</a>
            </p>
            <p>
              Quay lại <a href="#">Trang chủ</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
