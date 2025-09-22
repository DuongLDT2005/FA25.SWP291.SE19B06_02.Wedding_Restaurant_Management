const API_URL = "/api/auth";

// Login
export const login = async ({ email, password, remember }) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember }),
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
