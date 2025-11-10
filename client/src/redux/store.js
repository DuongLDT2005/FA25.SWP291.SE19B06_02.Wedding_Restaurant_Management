import { configureStore } from "@reduxjs/toolkit"
import wardReducer from "./slices/wardSlice"
import authReducer from "./slices/authSlice"
import searchReducer from "./slices/searchSlice"
import amenityReducer from "./slices/amenitySlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    wards: wardReducer,
    amenities: amenityReducer,
  },
})

export default store
