import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  login as loginThunk,
  logout as logoutThunk,
  fetchCurrentUser,
  signUpCustomer as signUpCustomerThunk,
  signUpPartner as signUpPartnerThunk,
  forgotPassword as forgotPasswordThunk,
  resetPassword as resetPasswordThunk,
  setUser,
  clearError,
  clearSuccess,
} from "../redux/slices/authSlice";
import { loginWithGooglePopup } from "../firebase/firebase";

/**
 * useAuth hook (Redux backed)
 * - returns user, loading, error, successMessage, isAuthenticated
 * - exposes login/logout/refresh/signUp/forgot/reset helpers
 */
export default function useAuth() {
  const dispatch = useDispatch();
  const { user, isLoading, error, successMessage } = useSelector(
    (state) => state.auth || {}
  );

  const isAuthenticated = !!user;

  /** Đăng nhập */
  const login = useCallback(
    async (credentials) => {
      const action = await dispatch(loginThunk(credentials));
      if (loginThunk.rejected.match(action))
        throw action.payload || action.error.message;
      return action.payload;
    },
    [dispatch]
  );

  /** Đăng xuất */
  const logout = useCallback(async () => {
    const action = await dispatch(logoutThunk());
    if (logoutThunk.rejected.match(action))
      throw action.payload || action.error.message;
    dispatch(setUser(null)); // đảm bảo xóa user local
    // Reload page to fully reset client state and pick up cleared HttpOnly cookie
    // You can change to: window.location.assign('/') if you prefer redirect to home
    window.location.reload();
  }, [dispatch]);

  /** Lấy user hiện tại */
  const refreshUser = useCallback(async () => {
    const action = await dispatch(fetchCurrentUser());
    if (fetchCurrentUser.rejected.match(action)) {
      dispatch(setUser(null));
      throw action.payload || action.error.message;
    }
    return action.payload;
  }, [dispatch]);

  /** Đăng ký Customer */
  const signUpCustomer = useCallback(
    async (payload) => {
      const action = await dispatch(signUpCustomerThunk(payload));
      if (signUpCustomerThunk.rejected.match(action))
        throw action.payload || action.error.message;
      return action.payload;
    },
    [dispatch]
  );

  /** Đăng ký Partner */
  const signUpPartner = useCallback(
    async (payload) => {
      const action = await dispatch(signUpPartnerThunk(payload));
      if (signUpPartnerThunk.rejected.match(action))
        throw action.payload || action.error.message;
      return action.payload;
    },
    [dispatch]
  );

  /** Quên mật khẩu */
  const forgotPassword = useCallback(
    async (email) => {
      const action = await dispatch(forgotPasswordThunk(email));
      if (forgotPasswordThunk.rejected.match(action))
        throw action.payload || action.error.message;
      return action.payload;
    },
    [dispatch]
  );

  /** Đặt lại mật khẩu */
  const resetPassword = useCallback(
    async (payload) => {
      const action = await dispatch(resetPasswordThunk(payload));
      if (resetPasswordThunk.rejected.match(action))
        throw action.payload || action.error.message;
      return action.payload;
    },
    [dispatch]
  );

  /** Xóa lỗi và thông báo thành công */
  const clearAuthError = useCallback(() => dispatch(clearError()), [dispatch]);
  const clearAuthSuccess = useCallback(
    () => dispatch(clearSuccess()),
    [dispatch]
  );

  const loginWithGoogle = async () => {
    try {
      // 1. Login Firebase popup
      const result = await loginWithGooglePopup();
      const firebaseUser = result.user;

      // 2. Lấy Firebase ID token
      const token = await firebaseUser.getIdToken();

      // 3. Gửi token sang backend
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      // 4. Lưu user vào redux
      dispatch(setUser(data.user));

      return data.user;
    } catch (err) {
      throw err;
    }
  };

  return {
    user,
    isLoading,
    error,
    successMessage,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    signUpCustomer,
    signUpPartner,
    forgotPassword,
    resetPassword,
    clearAuthError,
    clearAuthSuccess,
    loginWithGoogle,
  };
}
