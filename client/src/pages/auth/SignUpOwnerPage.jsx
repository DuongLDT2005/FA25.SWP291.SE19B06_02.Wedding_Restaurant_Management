import { uploadImageToCloudinary } from "../../services/uploadServices"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { signUpOwner } from "../../services/authService"
import { Container, Form } from "react-bootstrap"
import AuthLayout from "../../layouts/AuthLayout"

function SignUpForOwner() {
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validateForm = (name, phoneNumber, email, password, confirmPassword, file) => {
    const newErrors = {}

    if (!name) {
      newErrors.name = "Vui lòng nhập tên."
    } else if (name.length < 6) {
      newErrors.name = "Tên phải ít nhất 6 ký tự."
    }

    const phoneRegex = /^0\d{9}$/
    if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số."
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng."
    }

    const passwordRegex = /^[A-Za-z0-9]{6,}$/
    if (!passwordRegex.test(password)) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự, chỉ chứa chữ hoặc số."
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp."
    }

    if (!file) {
      newErrors.licenseUrl = "Bạn cần upload giấy phép cá nhân."
    }

    return newErrors
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    setFile(selectedFile)
    if (selectedFile) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.licenseUrl
        return next
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const name = event.target.name.value
    const phoneNumber = event.target.phoneNumber.value
    const email = event.target.email.value

    const formErrors = validateForm(name, phoneNumber, email, password, confirmPassword, file)

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    try {
      const secureUrl = await uploadImageToCloudinary(file)
      console.log("Cloudinary URL:", secureUrl)
      await signUpOwner({
        name,
        phoneNumber,
        email,
        password,
        licenseUrl: secureUrl,
      })

      setErrors({})
      setPassword("")
      setConfirmPassword("")
      setFile(null)
    } catch (err) {
      console.error(err)
      setErrors({ form: "Có lỗi xảy ra, vui lòng thử lại." })
    }
  }

  return (
    <AuthLayout>
      <Container fluid className="p-0" style={{ minHeight: "100vh", paddingTop: "120px" }}>
        <style>{`
          .signup-wrapper {
            display: grid;
            grid-template-columns: 52% 48%;
            border-radius: 15px;
            margin: 100px auto 40px auto;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            background: white;
            max-width: 100%;
          }
          @media (max-width: 768px) {
            .signup-wrapper {
              grid-template-columns: 1fr;
            }
          }
          .signup-slogan {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            background: #E11D48;
            color: #fefaf9;
            padding: 60px 70px;
            border-radius: 15px 0 0 15px;
            text-align: left;
            min-height: 420px;
          }

          @media (max-width: 768px) {
            .signup-slogan {
              justify-content: center;
              padding: 60px 40px;
              border-radius: 15px 15px 0 0;
            }
          }

          .signup-slogan h2 {
            font-size: 50px;
            margin-bottom: 10px;
            font-weight: 700;
          }
          .signup-slogan p {
            font-size: 18px;
            line-height: 1.5;
            margin: 0;
            width: 80%;
          }
          .signup-form-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 40px;
            background: #fff;
            border-radius: 0 15px 15px 0;
          }
          @media (max-width: 768px) {
            .signup-form-container {
              border-radius: 0 0 15px 15px;
            }
          }
          .signup-form-container h1 {
            margin-bottom: 20px;
            font-size: 32px;
            text-align: center;
            color: #E11D48;
            font-weight: 700;
          }
          .signup-input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 15px;
          }
          .password-wrapper {
            position: relative;
            width: 100%;
            margin-bottom: 4px;
            height: auto;
          }
          .password-wrapper input {
            width: 100%;
            padding: 12px 40px 12px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 15px;
            box-sizing: border-box;
            height: auto;
          }
          .toggle-password {
            position: absolute;
            top: 50%;
            right: 12px;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            cursor: pointer;
            color: #777;
            font-size: 18px;
            z-index: 3;
            pointer-events: auto;
          }
          .signup-btn {
            width: 100%;
            background: #E11D48;
            border: none;
            color: #fff;
            font-weight: 600;
            font-size: 15px;
            border-radius: 6px;
            padding: 12px 0;
            margin: 20px 0;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .signup-btn:hover {
            background: #c81344;
            transform: translateY(-2px);
          }
          .error-message {
            color: #E11D48;
            font-size: 14px;
            margin-top: 2px;
            margin-bottom: 10px;
            display: block;
            min-height: 18px;
          }
          .signup-link {
            text-align: center;
            font-size: 14px;
            color: #999;
          }
          .signup-link a {
            text-decoration: none;
            color: #f6a401;
            font-weight: 500;
          }
          .signup-link a:hover {
            text-decoration: underline;
          }
        `}</style>

        <div className="signup-wrapper" style={{ maxWidth: "1000px", width: "100%", margin: "20px auto" }}>
          <div className="signup-slogan">
            <h2>Chào mừng!</h2>
            <p>
              Hãy để mọi người biết về nhà hàng của bạn và thu hút khách hàng tiềm năng. Đăng ký ngay để bắt đầu hành
              trình kinh doanh ẩm thực thành công của bạn cùng chúng tôi!
            </p>
          </div>

          <div className="signup-form-container">
            <h1>Đăng Ký Chủ Nhà Hàng</h1>
            <form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Họ và tên"
                  className={`form-control signup-input ${errors.name ? "is-invalid" : ""}`}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Số điện thoại"
                  maxLength={10}
                  onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                  className={`form-control signup-input ${errors.phoneNumber ? "is-invalid" : ""}`}
                />
                {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className={`form-control signup-input ${errors.email ? "is-invalid" : ""}`}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="password-wrapper">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className={`form-control ${passwordError || errors.password ? "is-invalid" : ""}`}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                  />
                  <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
                {(passwordError || errors.password) && (
                  <div className="error-message">{passwordError || errors.password}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="password-wrapper">
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                  />
                  <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </Form.Group>

              <Form.Group className="mb-3">
                <label htmlFor="licenseUrl" className="form-label">
                  <p className="mb-2">Upload giấy phép cá nhân</p>
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
              </Form.Group>

              <button type="submit" className="signup-btn">
                Đăng Ký
              </button>
            </form>

            <div className="signup-link">
              <p>
                Bạn đã có tài khoản? <a href="#">Đăng nhập</a>
              </p>
            </div>
            <div className="signup-link">
              <p>
                Quay lại <a href="/">Trang chủ</a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </AuthLayout>
  )
}

export default SignUpForOwner
