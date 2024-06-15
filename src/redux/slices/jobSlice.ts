import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../Utils/database";
import { addJobsToUser, removeJobFromUser } from "./userSlice";
const initialState = {
  data: [],
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
          registeredUser_id: newJobData.id,
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
export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default jobsSlice.reducer;
