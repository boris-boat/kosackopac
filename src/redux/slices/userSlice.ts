import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../Utils/database";
import { IInitialUserState } from "../types/userTypes";

const initialState: IInitialUserState = {
  data: {
    jobs: [],
  },
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
  console.log(data);
  return data.user;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    addJobsToUser: (state, action) => {
      state.data.jobs.push(action.payload);
    },
    removeJobFromUser: (state, action) => {
      state.data.jobs = state.data.jobs.filter(
        (job) => job.id !== action.payload
      );
    },
    updateUsersJobs: (state, action) => {
      state.data.jobs = state.data.jobs.map((job) =>
        job.id !== action.payload.id ? job : action.payload
      );
    },
    searchJobFilter: (state, action) => {
      state.data.jobs = state.data.jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(action.payload) ||
          job.description.toLowerCase().includes(action.payload)
      );
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

export const { setUser, addJobsToUser, removeJobFromUser, updateUsersJobs } =
  userSlice.actions;

export default userSlice.reducer;
