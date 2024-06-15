import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../Utils/database";

const initialState = {
  data: [],
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (userId) => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("registeredUsers_id", userId);
    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
);
export const addNewCustomer = createAsyncThunk(
  "customers/addNewCustomer",
  async (newCustomerData) => {
    console.log(newCustomerData);
    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          registeredUsers_id: newCustomerData.id,
          name: newCustomerData.name,
          phone: newCustomerData.phone,
          address: newCustomerData.address,
        },
      ])
      .select();
    console.log(error ?? data);
    return data[0];
  }
);

export const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers: (state, action) => (state.userData = action.payload),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(addNewCustomer.fulfilled, (state, action) => {
      state.data.push(action.payload);
    });
  },
});

export const { setCustomers } = customersSlice.actions;

export default customersSlice.reducer;
