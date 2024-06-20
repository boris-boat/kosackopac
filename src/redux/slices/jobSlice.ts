import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../Utils/database";
import { toast } from "react-toastify";
const initialState = {
  jobs: [],
  data: {
    focusedJob: {},
  },
  filter: "",
};
export const addNewJob = createAsyncThunk(
  "jobs/addNewJob",
  async (newJobData) => {
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
    console.log(data[0]);
    return data[0];
  }
);
export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id) => {
  await supabase.from("jobs").delete().eq("id", id);
  return id;
});
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (focusedJob) => {
    const { data, error } = await supabase
      .from("jobs")
      .update(focusedJob)
      .eq("id", focusedJob.id)
      .select();
    return data[0];
  }
);
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async (id) => {
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("registeredUser_id", id);
  return data;
  console.log(data);
});
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
    searchJobFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(addNewJob.fulfilled, (state, action) => {
        toast("Job added", {
          position: "bottom-center",
          type: "success",
        });
        state.jobs.push(action.payload);
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
        toast("Job deleted", {
          position: "bottom-center",
          type: "success",
        });
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        toast("Job updated", {
          position: "bottom-center",
          type: "success",
        });
        state.jobs = state.jobs.map((job) =>
          job.id !== action.payload.id ? job : action.payload
        );
      });
  },
});

export const { setFocusedJob, resetFocusedJob, searchJobFilter } =
  jobsSlice.actions;

export default jobsSlice.reducer;
