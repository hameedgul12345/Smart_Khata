import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */
export interface User {
  _id: string;
  name: string;
  email: string;
  // add other fields returned by your API
}

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
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
