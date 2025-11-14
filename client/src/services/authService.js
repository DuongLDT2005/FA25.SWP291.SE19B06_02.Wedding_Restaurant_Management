import axios from "../api/axios";

const API_URL = "/auth"; // axios baseURL = /api → tổng là /api/auth

/* -------------------- LOGIN -------------------- */
export const login = async ({ email, password }) => {
  const res = await axios.post(`${API_URL}/login`, {
    email,
    password,
  }, { withCredentials: true });

  return res.data;
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

    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Đăng ký Partner thất bại";
    throw new Error(msg);
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

  return res.data;
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
