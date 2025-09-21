import { Link } from "react-router-dom";
import { togglePassword } from "../togglePassword";
import { uploadImageToCloudinary } from "../../../services/uploadServices";
import React, { useState } from "react";
import "../../../styles/signUpForOwner.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function SignUpForOwner() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Xin vui lòng up file lên.");
      return;
    }

    try {
      const secureUrl = await uploadImageToCloudinary(file);
      console.log("Ảnh đã upload thành công:", {
        licenseUrl: secureUrl
      }); // lấy link URL của ảnh đã upload

      const apiRes = await fetch(
        process.env.REACT_APP_API_URL + "/owners/saveImage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ licenseUrl: secureUrl }),
        }
      );

      if (!apiRes.ok) {
        throw new Error("Lưu ảnh vào hệ thống thất bại!");
      }

      setMessage("Lưu hình ảnh thành công!");
    } catch (err) {
      console.error(err);
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="sign--up">
      <div className="sign--up--slogan">
        <h2>Xin chào !</h2>
        <p>Câu chuyện tình cảm của bạn xứng đáng được ghi khắc lại.</p>
      </div>
      <div className="sign--up--container">
        <h1>Đăng Ký Thành Chủ</h1>
        <form className="sign--up--form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">
              <span className="modern-auth-icon">
                <i className="fas fa-user"></i>
              </span>
            </label>
            <input type="text" id="name" name="name" placeholder="Nhập tên công ty của bạn" required />
          </div>
          <div>
            <label htmlFor="email">
              <span className="modern-auth-icon">
                <i className="fas fa-envelope"></i>
              </span>
            </label>
            <input type="email" id="email" name="email" placeholder="Email" required />
          </div>
          <div>
            <label htmlFor="password">
              <span className="modern-auth-icon">
                <i className="fas fa-lock"></i>
              </span>
            </label>
            <input type="password" id="password" name="password" placeholder="Mật khẩu" required />
            <span className="modern-auth-eye" onClick={(e) => togglePassword("password", e)}>
              <i className="fas fa-eye"></i>
            </span>
          </div>
          <div>
            <label htmlFor="confirmPassword">
              <span className="modern-auth-icon">
                <i className="fas fa-lock"></i>
              </span>
            </label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Xác nhận mật khẩu" required />
            <span className="modern-auth-eye" onClick={(e) => togglePassword("confirmPassword", e)}>
              <i className="fas fa-eye"></i>
            </span>
          </div>
          <div className="file--upload">
            <label htmlFor="licenseUrl" className="file--label">
              <p>Upload giấy phép cá nhân</p>
            </label>
            <input type="file" id="licenseUrl" name="licenseUrl" required onChange={handleFileChange} />
          </div>
          <button type="submit">Đăng ký</button>
        </form>

        {message && <p className="sign--up--message">{message}</p>}
        <div className="sign--up--footer">
          <div className="sign--up--link">
            <p>
              Bạn đã có tài khoản? <Link to="#">Đăng nhập</Link>
            </p>
          </div>
          <div className="sign--up--link">
            <Link to="/">Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForOwner;
