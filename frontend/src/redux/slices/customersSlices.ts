import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */
export interface Customer {
  _id: string;
  name: string;
  phone?: string;
  totalDue: number;
}

/* ================= SLICE ================= */
interface CustomersState {
  customers: Customer[];
}

const initialState: CustomersState = {
  customers: [],
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter(
        (c) => c._id !== action.payload
      );
    },
  },
});

export const { setCustomers, addCustomer, deleteCustomer } = customersSlice.actions;

export default customersSlice.reducer;
