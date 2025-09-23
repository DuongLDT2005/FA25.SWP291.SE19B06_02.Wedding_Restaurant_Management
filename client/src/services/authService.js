const API_URL = "/api/auth";

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

export const getCurrentUser = async () => {
  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Không thể lấy thông tin user");
  return data;
};

export const logout = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Đăng xuất thất bại");
};

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

export const resetPassword = async ({ token, newPassword }) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Đặt lại mật khẩu thất bại");
  return data;
};


export const signUpOwner = async ({ name, email, password, phone, licenseUrl }) => {
  const res = await fetch(`${API_URL}/signup/owner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone, licenseUrl }),
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result?.message || "Đăng ký Owner thất bại");
  return result;
};


export const signUpCustomer = async ({ fullname, weddingRole, partner, phone, email, password }) => {
  const res = await fetch(`${API_URL}/signup/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, weddingRole, partner, phone, email, password }),
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result?.message || "Đăng ký thất bại");
  return result;
};

// Function saveOwner to save owner data to backend
export async function saveOwner({ name, phoneNumber, email, password, licenseUrl }) {
  const apiUrl = process.env.REACT_APP_API_URL + "/owners/saveImage";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      phoneNumber,
      email,
      password,
      licenseUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Lưu ảnh vào hệ thống thất bại!");
  }

  return await response.json(); // trả về dữ liệu từ backend
}
