import { configureStore } from "@reduxjs/toolkit"
import wardReducer from "./slices/wardSlice"
import authReducer from "./slices/authSlice"
import searchReducer from "./slices/searchSlice"
import bookingReducer from "./slices/bookingSlice"
import eventTypeReducer from "./slices/eventTypeSlice";
import restaurantsReducer from "./slices/restaurantSlice";
import hallsReducer from "./slices/hallSlice";
import additionRestaurantReducer from "./slices/additionRestaurantSlice";
import paymentReducer from "./slices/paymentSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    wards: wardReducer,
    booking: bookingReducer,
    eventType: eventTypeReducer,
    restaurants: restaurantsReducer,
    halls: hallsReducer,
    additionRestaurant: additionRestaurantReducer,
    payment: paymentReducer,
  },
})

export default store
