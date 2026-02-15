import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */
export interface IItems {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  unit?: string;
  lowStockAlert?: number;
}

/* ================= STATE ================= */
interface ItemsState {
  items: IItems[];
}

const initialState: ItemsState = {
  items: [],
};

/* ================= SLICE ================= */
const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    // ADD ITEM
    addItem: (state, action: PayloadAction<IItems>) => {
      state.items.push(action.payload);
    },

    // UPDATE ITEM
    updateItem: (state, action: PayloadAction<IItems>) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    // DELETE ITEM
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    // SET ALL ITEMS (API DATA)
    setItems: (state, action: PayloadAction<IItems[]>) => {
      state.items = action.payload;
    },
  },
});

/* ================= EXPORTS ================= */
export const { addItem, updateItem, deleteItem, setItems } =
  itemsSlice.actions;

export default itemsSlice.reducer;
