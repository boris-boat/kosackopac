import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../Utils/database";

const initialState = {
  data: null,
  status: "idle",
  error: null,
};
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const { data, error } = await supabase
    .from("registeredUsers")
    .select(
      `
            *,
            jobs (
              *,
              customers (
                *
              )
            )
          `
    )
    .eq("id", "50939095-1094-4a64-b0b2-d37b31fc1fbd");

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => (state.userData = action.payload),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
