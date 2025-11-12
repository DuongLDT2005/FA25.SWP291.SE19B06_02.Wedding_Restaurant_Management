import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEventTypes } from "../../services/eventTypeService";

export const fetchEventTypes = createAsyncThunk(
  "eventType/fetchEventTypes",
  async () => {
    const data = await getEventTypes();
    return data;
  }
);

const eventTypeSlice = createSlice({
  name: "eventType",
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEventTypes.pending, state => {
        state.loading = true;
      })
      .addCase(fetchEventTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEventTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default eventTypeSlice.reducer;