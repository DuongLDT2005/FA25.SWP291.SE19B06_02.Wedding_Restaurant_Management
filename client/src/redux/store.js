import { configureStore } from "@reduxjs/toolkit";
import wardReducer from "./slices/wardSlice";
import authReducer from "./slices/authSlice";
import searchReducer from "./slices/searchSlice";
import eventTypeReducer from "./slices/eventTypeSlice";
import restaurantReducer from "./slices/restaurantSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    wards: wardReducer,
    eventType: eventTypeReducer,
    restaurants: restaurantReducer,
  },
});

export default store;
