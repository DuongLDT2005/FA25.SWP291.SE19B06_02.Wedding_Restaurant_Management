import { Link } from "react-router-dom";
import { uploadImageToCloudinary } from "../../services/uploadServices";
import React, { useState } from "react";
import "../../styles/signUpForOwnerStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signUpOwner } from "../../services/authService";

function SignUpForOwner() {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Validate form
  const validateForm = (name, phoneNumber, email, password, confirmPassword, file) => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Vui lòng nhập tên.";
    } else if (name.length < 6) {
      newErrors.name = "Tên phải ít nhất 6 ký tự.";
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }
    // thêm validate password
    const passwordRegex = /^[A-Za-z0-9]{6,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự, chỉ chứa chữ hoặc số.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (!file) {
      newErrors.licenseUrl = "Bạn cần upload giấy phép cá nhân.";
    }

    return newErrors;
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const phoneNumber = event.target.phoneNumber.value;
    const email = event.target.email.value;

    // validate bằng state
    const formErrors = validateForm(name, phoneNumber, email, password, confirmPassword, file);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const secureUrl = await uploadImageToCloudinary(file);
      console.log("Cloudinary URL:", secureUrl);
      await signUpOwner({ name, phoneNumber, email, password, licenseUrl: secureUrl });

      // 👉 Không dùng toast hay alert, chỉ reset form
      setErrors({});
      setPassword("");
      setConfirmPassword("");
      setFile(null);
    } catch (err) {
      console.error(err);
      // 👉 Có thể gán lỗi chung nếu muốn
      setErrors({ form: "Có lỗi xảy ra, vui lòng thử lại." });
    }
  };

  return (
    <div className="sign--up">
      <div className="sign--up--slogan">
        <h2>Xin chào !</h2>
        <p>Câu chuyện tình cảm của bạn xứng đáng được ghi khắc lại.</p>
      </div>
      <div className="sign--up--container">
        <h1>Đăng Ký Chủ Nhà Hàng</h1>
        <form className="sign--up--form" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              id="name"
              name="name"
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
              placeholder="Email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="password-wrapper">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              className={`form-control ${(passwordError || errors.password) ? "is-invalid" : ""}`}
              onChange={(e) => {
                const newValue = e.target.value;
                setPassword(newValue);
              }}
              placeholder="Mật khẩu"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {(passwordError || errors.password) && (
            <div className="error-message">{passwordError || errors.password}</div>
          )}

          <div className="password-wrapper">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              onChange={handleFileChange}
              accept="image/*"
            />
            {errors.licenseUrl && <div className="error-message">{errors.licenseUrl}</div>}
          </div>

          <button type="submit">Đăng ký</button>
        </form>
        <div className="sign--up--footer">
          <div className="sign--up--link">
            <p>
              Bạn đã có tài khoản? <Link to="#">Đăng nhập</Link>
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