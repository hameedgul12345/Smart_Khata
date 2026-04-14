import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */
export interface Customer {
  _id: string;
  name: string;
  phone?: string;
  totalAmount: number; // ✅ THIS = ACTUAL DUE (ledger system)
}

/* ================= STATE ================= */
interface CustomersState {
  customers: Customer[];
}

const initialState: CustomersState = {
  customers: [],
};

/* ================= SLICE ================= */
const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    /* SET ALL CUSTOMERS */
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },

    /* ✅ SET ONE CUSTOMER (UPDATE OR ADD) */
    setCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(
        (c) => c._id === action.payload._id
      );

      if (index !== -1) {
        // 🔁 update existing
        state.customers[index] = action.payload;
      } else {
        // ➕ add new
        state.customers.push(action.payload);
      }
    },

    /* ADD CUSTOMER */
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },

    /* DELETE CUSTOMER */
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter(
        (c) => c._id !== action.payload
      );
    },
  },
});

/* ================= EXPORTS ================= */
export const {
  setCustomers,
  setCustomer,   // ✅ NOW INCLUDED
  addCustomer,
  deleteCustomer,
} = customersSlice.actions;

export default customersSlice.reducer;