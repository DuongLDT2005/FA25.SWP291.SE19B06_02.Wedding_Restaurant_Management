import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as restaurantService from "../../services/restaurantService";

/* Helper: xử lý thông báo lỗi gọn gàng */
const getErrorMessage = (err) => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  if (err.error) return err.error;
  return JSON.stringify(err);
};

/* ====== Async Thunks ====== */

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await restaurantService.getRestaurants();
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  "restaurants/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await restaurantService.getRestaurantById(id);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const performSearchRestaurants = createAsyncThunk(
  "restaurants/search",
  async (params, { rejectWithValue }) => {
    try {
      const data = await restaurantService.searchRestaurants(params);

      // ✅ backend trả về { restaurants: [...] }
      if (data?.restaurants) return data.restaurants;
      if (Array.isArray(data)) return data;
      return data?.results ?? [];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchFeaturedRestaurants = createAsyncThunk(
  "restaurants/featured",
  async (_, { rejectWithValue }) => {
    try {
      const data = await restaurantService.getFeaturedRestaurants();
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const createRestaurant = createAsyncThunk(
  "restaurants/create",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await restaurantService.createRestaurant(payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

/* ====== Slice ====== */

const initialState = {
  list: [],
  featured: [],
  current: null,
  searchResults: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ========== FETCH ALL ========== */
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error?.message;
      })

      /* ========== FETCH BY ID ========== */
      .addCase(fetchRestaurantById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload ?? null;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error?.message;
      })

      /* ========== SEARCH RESTAURANTS ========== */
      .addCase(performSearchRestaurants.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(performSearchRestaurants.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ✅ chuẩn backend { restaurants: [...] }
        state.searchResults = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(performSearchRestaurants.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error?.message;
        state.searchResults = [];
      })

      /* ========== FEATURED ========== */
      .addCase(fetchFeaturedRestaurants.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFeaturedRestaurants.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.featured = action.payload || [];
      })
      .addCase(fetchFeaturedRestaurants.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error?.message;
      })

      /* ========== CREATE ========== */
      .addCase(createRestaurant.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) state.list.unshift(action.payload);
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error?.message;
      });
  },
});

/* ====== Selectors ====== */

export const { clearCurrent, clearError } = restaurantSlice.actions;

export const selectRestaurants = (state) => state.restaurants?.list ?? [];
export const selectFeaturedRestaurants = (state) =>
  state.restaurants?.featured ?? [];
export const selectCurrentRestaurant = (state) =>
  state.restaurants?.current ?? null;
export const selectSearchResults = (state) =>
  state.restaurants?.searchResults ?? [];
export const selectStatus = (state) => state.restaurants?.status ?? "idle";
export const selectError = (state) => state.restaurants?.error ?? null;

export default restaurantSlice.reducer;
