import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */
export interface User {
  _id: string;
  name: string;
  email: string;
  shopName?: string;

  role: "user" | "admin"; // ✅ enum match

  profilePicture?: string;

  isActive: boolean;

  plan: "free" | "basic" | "pro";

  subscriptionStatus: "active" | "expired" | "trial";

  subscriptionExpiresAt?: string; // Date comes as string from API

  stores: string[]; // ObjectId[] → string[]

  lastLogin?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* ================= STATE ================= */
interface UserState {
  user: User | null;
}

/* ================= INITIAL STATE ================= */
const initialState: UserState = {
  user: null,
};

/* ================= SLICE ================= */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },

    clearUser: (state) => {
      state.user = null;
    },
  },
});

/* ================= EXPORTS ================= */
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;