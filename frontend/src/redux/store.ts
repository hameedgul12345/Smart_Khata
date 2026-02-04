import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./slices/customersSlices";
import userReducer from "./slices/userSlice";

// 1️⃣ Configure the store
export const store = configureStore({
  reducer: {
    customers: customerReducer,
    user: userReducer,
  },
});

// 2️⃣ Type definitions for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
