import { configureStore } from "@reduxjs/toolkit"
import wardReducer from "./slices/wardSlice"
import authReducer from "./slices/authSlice"
import searchReducer from "./slices/searchSlice"
import bookingReducer from "./slices/bookingSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    wards: wardReducer,
    booking: bookingReducer,
  },
})

export default store
