import axios from "../api/axios";

const API_URL = "/auth";

/* -------------------- LOGIN -------------------- */
/* -------------------- LOGIN -------------------- */
export const login = async ({ email, password, tempToken }) => {
  const body = { email };
  
  if (tempToken) {
    // Nếu có tempToken (ví dụ: đăng nhập qua OTP), gửi tempToken
    body.tempToken = tempToken; 
  } else {
    // Nếu không có, gửi password thông thường
    body.password = password;
  }
  
  try {
    // Sử dụng axios.post, gửi body và cấu hình withCredentials: true
    const res = await axios.post(`${API_URL}/login`, body, {
      withCredentials: true, // Quan trọng: Đảm bảo cookie (JWT) được gửi và nhận
    });
    
    const data = res.data;
    
    // Lưu token cục bộ nếu server trả về (có thể xảy ra trong luồng OTP)
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    // Trả về dữ liệu người dùng/thông báo thành công
    return data;
    
  } catch (err) {
    // Axios sẽ ném lỗi cho các mã trạng thái 4xx/5xx.
    // Lấy thông báo lỗi từ phản hồi của server (err.response.data)
    const data = err.response?.data;
    
    // Ném lỗi với thông báo cụ thể từ server hoặc thông báo chung
    throw new Error(data?.message || data?.error || "Đăng nhập thất bại");
  }
};

/* -------------------- GET CURRENT USER -------------------- */
export const getCurrentUser = async () => {
  const res = await axios.get(`${API_URL}/me`, {
    withCredentials: true,
  });
  return res.data;
};

/* -------------------- LOGOUT -------------------- */
export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });

    // Xóa token local nếu có
    localStorage.removeItem("token");

    return { message: "Đăng xuất thành công" };
  } catch (err) {
    console.warn("[authService] Lỗi logout:", err.message);
    localStorage.removeItem("token");
    return { message: "Đăng xuất (fallback)" };
  }
};

/* -------------------- FORGOT PASSWORD -------------------- */
export const forgotPassword = async (email) => {
  const res = await axios.post(`${API_URL}/forgot-password`, 
    { email },
    { withCredentials: true }
  );
  return res.data;
};

/* -------------------- VERIFY OTP -------------------- */
export const verifyOtp = async ({ email, otp }) => {
  const res = await axios.post(`${API_URL}/verify-otp`, 
    { email, otp },
    { withCredentials: true }
  );
  return res.data;
};

/* -------------------- RESET PASSWORD -------------------- */
export const resetPassword = async ({ email, newPassword, tempToken }) => {
  const res = await axios.post(`${API_URL}/reset-password`, 
    { email, newPassword, tempToken },
    { withCredentials: true }
  );
  return res.data;
};

/* -------------------- SIGNUP OWNER (PARTNER) - UPLOAD FILE -------------------- */
export const signUpPartner = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}/signup/owner`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    // SỬA: Dùng res.data của Axios thay vì res.json() của fetch
    const result = res.data; 
    
    // Axios tự động xử lý lỗi HTTP status code, nếu lỗi sẽ nhảy vào catch block.
    // Dòng này không cần thiết khi dùng Axios, nhưng nếu muốn kiểm tra thêm có thể giữ lại
    // if (!res.ok) throw new Error(result?.error || result?.message || "Đăng ký Partner thất bại"); 
    
    return result;
  } catch (err) { // Thêm khối catch để xử lý lỗi khi dùng try
    // Ném lỗi lại để frontend có thể bắt và hiển thị
    throw new Error(err.response?.data?.message || err.message || "Đăng ký Partner thất bại");
  }
};

/* -------------------- SIGNUP CUSTOMER -------------------- */
export const signUpCustomer = async ({
  fullname,
  weddingRole,
  partner,
  phone,
  email,
  password,
}) => {
  try { // THÊM try...catch để bắt lỗi từ axios
    const res = await axios.post(
      `${API_URL}/signup/customer`,
      {
        fullName: fullname,
        weddingRole,
        partnerName: partner,
        phone,
        email,
        password,
      },
      { withCredentials: true }
    );

    // SỬA: Lấy dữ liệu từ res.data
    const result = res.data;

    return result;
  } catch (error) { // Bắt lỗi từ axios (bao gồm 409)
    const res = error.response;
    const result = res?.data;

    const err = new Error(result?.error || result?.message || "Đăng ký thất bại");
    err.status = res?.status;
    err.data = result;

    // Nếu backend trả 409 Conflict (email trùng) thì đính kèm thông tin email
    if (res?.status === 409) {
      err.duplicateField = result?.field || "email";
      err.duplicateValue = result?.value || email;
    }

    throw err;
  }
};

/* -------------------- SAVE PARTNER (Nếu sau này cần dùng) -------------------- */
export async function savePartner({
  name,
  phoneNumber,
  email,
  password,
  licenseUrl,
}) {
  const res = await axios.post(`${API_URL}/signup/owner`, {
    fullName: name,
    phone: phoneNumber,
    email,
    password,
    licenseUrl,
  });

  return res.data;
}
