import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingService from "../../services/bookingService";

export const submitBooking = createAsyncThunk(
  "booking/submit",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await bookingService.createBooking(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err?.message || err);
    }
  }
);

export const fetchPromotions = createAsyncThunk(
  "booking/fetchPromotions",
  async (params, { rejectWithValue }) => {
    try {
      const data = await bookingService.getPromotions(params);
      return data;
    } catch (err) {
      return rejectWithValue(err?.message || err);
    }
  }
);

const initialState = {
  customer: { name: "", phone: "", email: "", address: "" },
  bookingInfo: {
    restaurant: "",
    hall: "",
    date: "",
    tables: 1,
    eventType: "Tiệc cưới",
  },
  menu: null, // { id, name, price, categories... }
  services: [], // selected service objects
  promotions: [], // suggestions
  appliedPromotion: null,
  priceSummary: { guests: 0, menuTotal: 0, servicesTotal: 0, subtotal: 0, discount: 0, vat: 0, total: 0 },
  status: "idle",
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setCustomerField(state, action) {
      const { key, value } = action.payload;
      state.customer[key] = value;
    },
    setBookingField(state, action) {
      const { key, value } = action.payload;
      state.bookingInfo[key] = value;
    },
    setMenu(state, action) {
      state.menu = action.payload;
    },
    toggleService(state, action) {
      const svc = action.payload;
      const exists = state.services.find((s) => s.id === svc.id);
      if (exists) state.services = state.services.filter((s) => s.id !== svc.id);
      else state.services.push(svc);
    },
    setPromotions(state, action) {
      state.promotions = action.payload;
    },
    applyPromotion(state, action) {
      state.appliedPromotion = action.payload;
    },
    clearBooking(state) {
      return initialState;
    },
    setPriceSummary(state, action) {
      state.priceSummary = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBooking.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(submitBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error?.message;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.promotions = action.payload || [];
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.promotions = [];
      });
  },
});

export const {
  setCustomerField,
  setBookingField,
  setMenu,
  toggleService,
  setPromotions,
  applyPromotion,
  clearBooking,
  setPriceSummary,
  clearError,
} = bookingSlice.actions;

export const selectBooking = (state) => state.booking ?? initialState;
export default bookingSlice.reducer;