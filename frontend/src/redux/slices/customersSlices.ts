import { createSlice } from "@reduxjs/toolkit";

const customersSlices = createSlice({
  name: "customers",
  initialState: {
    customers: [],
  },
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(
        (c) => c._id !== action.payload
      );
    },
  },
});

export const { setCustomers, addCustomer, deleteCustomer } =
  customersSlices.actions;

export default customersSlices.reducer;
