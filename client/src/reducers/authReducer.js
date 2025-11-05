export const initialAuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, isLoading: false, user: action.payload };
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false, error: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    case "SET_USER":
      return { ...state, user: action.payload };

    default:
      return state;
  }
};