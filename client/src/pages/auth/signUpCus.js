import { useState } from "react";
import "../../styles/signUpCus.css";

export default function SignUpCus() {
  const [form, setForm] = useState({
    fullname: "",
    role: "",
    partner: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "", // thêm confirm password
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    // Họ và tên
    if (!/^[A-Za-zÀ-ỹ\s]+$/.test(form.fullname)) {
      newErrors.fullname = "Họ và tên chỉ được nhập chữ";
    }

    // Bạn là?
    if (!form.role) {
      newErrors.role = "Vui lòng chọn một lựa chọn";
    }

    // Người đồng hành
    if (form.partner && !/^[A-Za-zÀ-ỹ\s]+$/.test(form.partner)) {
      newErrors.partner = "Tên chỉ được nhập chữ";
    }

    // SĐT
    if (!/^[0-9]{9,11}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại chỉ gồm số, từ 9-11 chữ số";
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
              />
              {errors.fullname && <p className="error">{errors.fullname}</p>}
            </div>

            {/* Bạn là */}
            <div className="form-group">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="" disabled hidden>Bạn là?</option>
                <option value="Cô dâu">Cô dâu</option>
                <option value="Chú rể">Chú rể</option>
                <option value="Khác">Khác</option>
              </select>
              {errors.role && <p className="error">{errors.role}</p>}
            </div>

            {/* Người đồng hành */}
            <div className="form-group">
              <input
                type="text"
                placeholder="Tên người đồng hành cùng bạn"
                value={form.partner}
                onChange={(e) => setForm({ ...form, partner: e.target.value })}
              />
              {errors.partner && <p className="error">{errors.partner}</p>}
            </div>

            {/* Số điện thoại */}
            <div className="form-group">
              <input
                type="text"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="form-group email-group">
              <input
                type="text"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <span>@gmail.com</span>
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            {/* Địa chỉ */}
            <div className="form-group">
              <input
                type="text"
                placeholder="Địa chỉ"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {/* Mật khẩu */}
            <div className="form-group">
              <input
                type="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            {/* Nhập lại mật khẩu */}
            <div className="form-group">
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
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
