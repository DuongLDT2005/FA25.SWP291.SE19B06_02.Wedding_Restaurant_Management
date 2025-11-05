import { Link } from "react-router-dom";
import { uploadImageToCloudinary } from "../../services/uploadServices";
import React, { useState } from "react";
import "../../styles/signUpForOwnerStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function SignUpForOwner() {
  const navigate = useNavigate();
  const { signUpOwner } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseUrl: "",
  });
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Validate form
  const validateForm = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Tên không được để trống.";
    } else if (!form.name.length < 6) {
      e.name = "Tên phải ít nhất 6 ký tự.";
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.phoneNumber)) {
      e.phoneNumber = "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số.";
    }

    const emailRegex = /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(form.email)) {
      e.email = "Email không hợp lệ.";
    }

    if (!form.password || form.password.length < 6) {
      e.password = "Mật khẩu phải ít nhất 6 ký tự.";
    }

    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    // require license either via uploaded file or URL
    if (!file && !form.licenseUrl) {
      e.licenseUrl = "Bạn cần upload giấy phép kinh doanh.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.licenseUrl;
        return next;
      });
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      let licenseUrl = form.licenseUrl;

      if (file) {
        // upload file to cloudinary (or your upload service)
        const secureUrl = await uploadImageToCloudinary(file);
        licenseUrl = secureUrl;
      }
      await signUpOwner({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        licenseUrl,
      });
      navigate("/login");
    } catch (err) {
      const message = err?.message || String(err);
      // set general form error
      setErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setSubmitting(false);
    }

    // try {
    //   const secureUrl = await uploadImageToCloudinary(file);
    //   console.log("Cloudinary URL:", secureUrl);
    //   await signUpOwner({ name, phoneNumber, email, password, licenseUrl: secureUrl });

    //   // 👉 Không dùng toast hay alert, chỉ reset form
    //   setErrors({});
    //   setPassword("");
    //   setConfirmPassword("");
    //   setFile(null);
    // } catch (err) {
    //   console.error(err);
    //   // 👉 Có thể gán lỗi chung nếu muốn
    //   setErrors({ form: "Có lỗi xảy ra, vui lòng thử lại." });
    // }
  };

  return (
    <div className="sign--up">
      <div className="sign--up--slogan">
        <h2>Xin chào !</h2>
        <p>Câu chuyện tình cảm của bạn xứng đáng được ghi khắc lại.</p>
      </div>
      <div className="sign--up--container">
        <h1>Đăng Ký Đối Tác Nhà Hàng</h1>
        <form className="sign--up--form" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              id="name"
              name="name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tên"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Số điện thoại"
              maxLength={10}
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
              className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
            />
            {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
          </div>

          <div>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="password-wrapper">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              className={`form-control ${(errors.password) ? "is-invalid" : ""}`}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mật khẩu"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {(errors.password) && (
            <div className="error-message">{errors.password}</div>
          )}

          <div className="password-wrapper">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Xác nhận mật khẩu"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}

          <div className="file--upload">
            <label htmlFor="licenseUrl" className="file--label">
              <p>Upload giấy phép cá nhân</p>
            </label>
            <input
              type="file"
              id="licenseUrl"
              name="licenseUrl"
              className={`form-control ${errors.licenseUrl ? "is-invalid" : ""}`}
              onChange={(e) => setForm({ ...form, licenseUrl: e.target.value })} accept="image/*"
            />
            {errors.licenseUrl && <div className="error-message">{errors.licenseUrl}</div>}
          </div>

          <button type="submit">Đăng ký</button>
        </form>
        <div className="sign--up--footer">
          <div className="sign--up--link">
            <p>
              Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </div>
          <div className="sign--up--link">
            <p>
              Quay về <Link to="/">trang chủ</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForOwner;