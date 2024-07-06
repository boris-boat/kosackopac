import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../Utils/database";
import { toast } from "react-toastify";
import { IJob, IJobsState } from "../types/jobsTypes";

const initialState: IJobsState = {
  jobs: [],
  data: {
    focusedJob: {},
  },
  filter: "",
};
const databaseName = import.meta.env.VITE_JOBS_DATABASE;

export const addNewJob = createAsyncThunk(
  "jobs/addNewJob",
  async (newJobData: IJob) => {
    const { data, error } = await supabase
      .from(databaseName)
      .insert([
        {
          title: newJobData.title,
          description: newJobData.description,
          customer_id: newJobData.customer_id,
          registeredUser_id: newJobData.registeredUser_id,
          //@ts-expect-error date is being parsed to fit description
          scheduledDate: newJobData.parsedDate,
          status: "pending",
        },
      ])
      .select();
    if (error) {
      return;
    }
    return data[0];
  }
);
export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id) => {
  await supabase.from(databaseName).delete().eq("id", id);
  return id;
});
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (focusedJob: IJob) => {
    const { data, error } = await supabase
      .from(databaseName)
      .update(focusedJob)
      .eq("id", focusedJob.id)
      .select();
    if (error) {
      return;
    }
    return data[0];
  }
);
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async (id) => {
  const { data } = await supabase
    .from(databaseName)
    .select("*")
    .eq("registeredUser_id", id);
  return data;
});
export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setFocusedJob: (state, action) => {
      state.data.focusedJob = {
        ...state.data.focusedJob,
        ...action.payload,
      };
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
