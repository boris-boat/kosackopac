import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../Utils/database";
import { IInitialUserState, IUser } from "../types/userTypes";

const initialState: IInitialUserState = {
  status: "idle",
  error: "",
  userData: null,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async (userId) => {
  const { data, error } = await supabase
    .from("auth.users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  if (error) {
    throw new Error(error.message);
  }
  console.log(data);
  return data[0];
});

export const loginUser = createAsyncThunk("user/loginUser", async () => {
  const { data } = await supabase.auth.getSession();
  return data.user as IUser;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
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
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
