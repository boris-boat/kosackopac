import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../Utils/database";
import { addJobsToUser, removeJobFromUser, updateUsersJobs } from "./userSlice";
const initialState = {
  data: {
    focusedJob: {},
  },
};
export const addNewJob = createAsyncThunk(
  "jobs/addNewJob",
  async (newJobData, { dispatch }) => {
    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          title: newJobData.title,
          description: newJobData.description,
          customer_id: newJobData.customer_id,
          registeredUser_id: newJobData.registeredUser_id,
          scheduledDate: newJobData.parsedDate,
          status: "pending",
        },
      ])
      .select();
    dispatch(addJobsToUser(data[0]));

    return data[0];
  }
);
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { dispatch }) => {
    await supabase.from("jobs").delete().eq("id", id);

    dispatch(removeJobFromUser(id));
  }
);
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (focusedJob, { dispatch }) => {
    console.log(focusedJob);
    const { data, error } = await supabase
      .from("jobs")
      .update(focusedJob)
      .eq("id", focusedJob.id)
      .select();
    console.log(error ?? data);
    dispatch(updateUsersJobs(data[0]));
  }
);
export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setFocusedJob: (state, action) => {
      state.data.focusedJob = { ...state.data.focusedJob, ...action.payload };
    },
    resetFocusedJob: (state) => {
      state.data.focusedJob = {};
    },
  },
  extraReducers: (builder) => {},
});

export const { setFocusedJob, resetFocusedJob } = jobsSlice.actions;

export default jobsSlice.reducer;
