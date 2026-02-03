import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./slices/customersSlices";
import userReducer from "./slices/userSlice";
 const store = configureStore({
  reducer: {
    customers: customerReducer,
    user:userReducer,
  },
});

export default store;