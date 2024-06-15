import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import customerReducer from "./slices/customerSlice";
import jobsReducer from "./slices/jobSlice";
export const store = configureStore({
  reducer: {
    userData: userReducer,
    customersData: customerReducer,
    jobsData: jobsReducer,
  },
});
