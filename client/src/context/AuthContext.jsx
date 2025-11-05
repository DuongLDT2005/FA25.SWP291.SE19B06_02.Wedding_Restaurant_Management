import { createContext, useReducer, useEffect } from "react";
import { AuthReducer, initialAuthState } from "../reducers/authReducer";
import { getCurrentUser, logout } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialAuthState);

  // load user khi app mở lại
  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        dispatch({ type: "SET_USER", payload: user });
      } catch (err) {
        console.warn("Không lấy được user:", err.message);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await logout();
    dispatch({ type: "LOGOUT" });
  };

  const value = {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    dispatch,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};