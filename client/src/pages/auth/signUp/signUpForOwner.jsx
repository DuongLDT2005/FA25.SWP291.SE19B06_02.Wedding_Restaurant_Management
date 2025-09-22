import { Link } from "react-router-dom";
import { togglePassword } from "../../owner/togglePassword";
import { uploadImageToCloudinary } from "../../../services/uploadServices";
import React, { useState } from "react";
import "../../../styles/signUpForOwnerStyles.css";
import "../../../styles/toastStyles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { showToast } from "../../../services/toast";

function SignUpForOwner() {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Validate form
  const validateForm = (name, email, password, confirmPassword, file) => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Vui lòng nhập tên.";
    } else if (name.length < 6) {
      newErrors.name = "Tên phải ít nhất 6 ký tự.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    const passwordRegex = /^[A-Za-z0-9]{6,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự, chỉ chứa chữ hoặc số";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (!file) {
      newErrors.licenseUrl = "Bạn cần upload giấy phép cá nhân.";
    }

    return newErrors;
  };

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    const formErrors = validateForm(name, email, password, confirmPassword, file);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      const firstError = Object.values(formErrors)[0];
      showToast(firstError, "error");
      return;
    }

    setErrors({});

    try {
      const secureUrl = await uploadImageToCloudinary(file);
      console.log("Ảnh đã upload thành công:", { licenseUrl: secureUrl });

      const apiRes = await fetch(process.env.REACT_APP_API_URL + "/owners/saveImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, licenseUrl: secureUrl }),
      });

      if (!apiRes.ok) throw new Error("Lưu ảnh vào hệ thống thất bại!");

      showToast("Đăng ký thành công!", "success");
    } catch (err) {
      console.error(err);
      showToast("Có lỗi xảy ra, vui lòng thử lại.", "error");
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
            <input type="text" id="name" name="name" placeholder="Tên" className={`form-control ${errors.name ? "is-invalid" : ""}`} required />
          </div>
          <div>
            <input type="email" id="email" name="email" placeholder="Email" className={`form-control ${errors.email ? "is-invalid" : ""}`} />
            </div>
          <div>
            <input type="password" id="password" name="password" placeholder="Mật khẩu" className={`form-control ${errors.password ? "is-invalid" : ""}`} />
            <span className="modern-auth-eye" onClick={(e) => togglePassword("password", e)}><i className="fas fa-eye"></i></span>
          </div>
          <div>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Xác nhận mật khẩu" className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} />
            <span className="modern-auth-eye" onClick={(e) => togglePassword("confirmPassword", e)}><i className="fas fa-eye"></i></span>
          </div>
          <div className="file--upload">
            <label htmlFor="licenseUrl" className="file--label"><p>Upload giấy phép cá nhân</p></label>
            <input type="file" id="licenseUrl" name="licenseUrl" className={`form-control ${errors.licenseUrl ? "is-invalid" : ""}`} onChange={handleFileChange} accept="image/*" />
          </div>
          <button type="submit">Đăng ký</button>
        </form>
        <div className="sign--up--footer">
          <div className="sign--up--link">
            <p>Bạn đã có tài khoản? <Link to="#">Đăng nhập</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForOwner;
