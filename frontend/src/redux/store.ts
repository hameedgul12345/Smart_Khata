import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./slices/customersSlices";
import userReducer from "./slices/userSlice";
import itemsReducer from "./slices/itemsSlice";
// 1️⃣ Configure the store
export const store = configureStore({
  reducer: {
    customers: customerReducer,
    user: userReducer,
    items: itemsReducer,
  },
});

// 2️⃣ Type definitions for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
