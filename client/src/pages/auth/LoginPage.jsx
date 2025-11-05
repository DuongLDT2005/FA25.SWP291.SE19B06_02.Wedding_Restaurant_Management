import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/LoginStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/Footer";

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

  const emailIsValid = (e) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.trim());
  const navigate = useNavigate();

  // 🔹 Submit login
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setInfo("");
    setGlobalError("");
    setEmailError("");
    setPasswordError("");

    let valid = true;
    if (!emailIsValid(email)) {
      setEmailError("Vui lòng nhập email hợp lệ");
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
      console.log("Login success:", data);
      // Redirect theo role
      if (data.role === "ADMIN") {
        navigate("/admin");
      } else if (data.role === "RESTAURANT_PARTNER") {
        navigate("/partner");
      } else {
        navigate("/customer/home");
      }
    } catch (err) {
      setGlobalError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Forgot password
  const handleForgot = async (ev) => {
    ev.preventDefault();
    setForgotEmailError("");
    setInfo("");
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
      setForgotGlobalError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  // 🔹 Google Sign In
  const openGoogleSignIn = () => {
    const w = 600, h = 700;
    const left = (window.screenX || 0) + (window.innerWidth - w) / 2;
    const top = (window.screenY || 0) + (window.innerHeight - h) / 2;
    window.open(
      "/api/auth/google",
      "GoogleSignIn",
      `width=${w},height=${h},left=${left},top=${top}`
    );
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          {/* Left side */}
          <div className="login-box-left">
            <h1>Welcome back!</h1>
            <p>Đăng nhập để tiếp tục đặt tiệc và khám phá ưu đãi tại LifEvent.com.</p>
          </div>

          {/* Right side */}
          <div className="login-box-right">
            <h1>Đăng Nhập</h1>

            {globalError && <div className="alert error">{globalError}</div>}
            {info && <div className="alert success">{info}</div>}

            <form onSubmit={handleSubmit} className="form">
              {/* Email */}
              <div className="form-group">
                <input name="email" type="email" value={email} className={emailError ? "is-invalid" : ""} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                />
                {emailError && <div className="invalid-feedback">{emailError}</div>}
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="password-wrapper">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className={passwordError ? "is-invalid" : ""}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
                {passwordError && <div className="invalid-feedback">{passwordError}</div>}
              </div>

              {/* Options */}
              <div className="form-options">
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setShowForgot(true)}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button type="submit" disabled={loading} className="btn primary">
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>

            <div className="divider">Hoặc đăng nhập với</div>

            <div className="google-login-center">
              <button className="google-login-icon-btn" onClick={openGoogleSignIn}>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                />
              </button>
            </div>

            <p className="signup-links">
              Bạn mới đặt tiệc lần đầu? <a href="/signup/customer">Tham gia ngay</a>
            </p>
            <p className="signup-links">
              Bạn là đối tác nhà hàng mới muốn hợp tác?{" "}
              <a href="/signup/owner">Đăng ký ngay</a>
            </p>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgot && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Đặt lại mật khẩu</h2>
              <p>Nhập email để nhận đường dẫn đặt lại mật khẩu.</p>
              {forgotGlobalError && <div className="alert error">{forgotGlobalError}</div>}
              {forgotEmailError && <div className="alert error">{forgotEmailError}</div>}
              <form onSubmit={handleForgot}>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => setShowForgot(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn primary" disabled={forgotLoading}>
                    {forgotLoading ? "Đang gửi..." : "Gửi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
