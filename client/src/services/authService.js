const API_URL = "/api/auth";

/* -------------------- LOGIN -------------------- */
export const login = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Đăng nhập thất bại");
  return data;
};

/* -------------------- GET CURRENT USER -------------------- */
export const getCurrentUser = async () => {
  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Không thể lấy thông tin user");
  return data;
};

/* -------------------- LOGOUT -------------------- */
export const logout = async () => {
  try {
    const res = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    // Nếu backend chưa có endpoint logout, ta vẫn xử lý local
    if (!res.ok) {
      console.warn("[] Logout API không khả dụng hoặc trả lỗi, dùng fallback local.");
    }

    // Xóa token local nếu có
    localStorage.removeItem("token");

    // Không ném lỗi để frontend không crash
    return { message: "Đăng xuất thành công (local fallback)" };
  } catch (err) {
    console.warn("[] Lỗi logout:", err.message);

    // Dù lỗi cũng vẫn xóa token để user thực sự đăng xuất
    localStorage.removeItem("token");
    return { message: "Đăng xuất thành công (local fallback)" };
  }
};

/* -------------------- FORGOT PASSWORD -------------------- */
export const forgotPassword = async (email) => {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Yêu cầu thất bại");
  return data;
};

/* -------------------- VERIFY OTP -------------------- */
export const verifyOtp = async ({ email, otp }) => {
  const res = await fetch(`${API_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Xác minh OTP thất bại");
  return data; // { message, tempToken }
};

/* -------------------- RESET PASSWORD -------------------- */
export const resetPassword = async ({ email, newPassword, tempToken }) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword, tempToken }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Đặt lại mật khẩu thất bại");
  return data;
};

/* -------------------- SIGNUP OWNER (PARTNER) -------------------- */
export const signUpPartner = async ({ name, email, password, phone, licenseUrl }) => {
  const res = await fetch(`${API_URL}/signup/owner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: name,
      email,
      password,
      phone,
      licenseUrl,
    }),
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result?.message || "Đăng ký Partner thất bại");
  return result;
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
  const res = await fetch(`${API_URL}/signup/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: fullname,
      weddingRole,
      partnerName: partner,
      phone,
      email,
      password,
    }),
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result?.message || "Đăng ký thất bại");
  return result;
};

/* -------------------- SAVE PARTNER (upload license to backend) -------------------- */
export async function savePartner({ name, phoneNumber, email, password, licenseUrl }) {
  const apiUrl = `${API_URL}/signup/owner`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: name,
      phone: phoneNumber,
      email,
      password,
      licenseUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Lưu ảnh vào hệ thống thất bại!");
  }

  return await response.json();
}
