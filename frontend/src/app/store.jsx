import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "../features/bookingSlice";

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
  },
});
