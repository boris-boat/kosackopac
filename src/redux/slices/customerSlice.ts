import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../Utils/database";
import { fetchUser } from "./userSlice";
import { toast } from "react-toastify";
import { ICustomer } from "../types/customerTypes";

const initialState = {
  data: [],
  focusedCustomer: {},
};
const databaseName = import.meta.env.VITE_CUSTOMERS_DATABASE;

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (userId) => {
    const { data, error } = await supabase
      .from(databaseName)
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
  async (newCustomerData: ICustomer) => {
    const { data, error } = await supabase
      .from(databaseName)
      .insert([
        {
          registeredUsers_id: newCustomerData.id,
          name: newCustomerData.name,
          phone: newCustomerData.phone,
          address: newCustomerData.address,
        },
      ])
      .select();
    if (error) {
      return;
    }
    return data[0] as ICustomer;
  }
);

export const editCustomer = createAsyncThunk(
  "customers/editCustomer",
  async (editCustomerData: ICustomer) => {
    const { data, error } = await supabase
      .from(databaseName)
      .update(editCustomerData)
      .eq("id", editCustomerData.id)
      .select();
    if (error) {
      return;
    }
    return data[0] as ICustomer;
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, { dispatch }) => {
    await supabase.from(databaseName).delete().eq("id", id);
    dispatch(fetchUser());
    return id;
  }
);

export const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setFocusedCustomer: (state, action) => {
      state.focusedCustomer = action.payload;
    },
    searchCustomersFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(addNewCustomer.fulfilled, (state, action) => {
      toast("Customer added", {
        position: "bottom-center",
        type: "success",
      });
      state.data.push(action.payload);
    });
    builder.addCase(editCustomer.fulfilled, (state, action) => {
      toast("Customer edited", {
        position: "bottom-center",
        type: "success",
      });
      state.data = state.data.map((customer) =>
        customer.id !== action.payload.id ? customer : action.payload
      );
    });
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      toast("Customer deleted", {
        position: "bottom-center",
        type: "success",
      });
      state.data = state.data.filter(
        (customer) => customer.id !== action.payload
      );
    });
  },
});

export const { setCustomers, setFocusedCustomer, searchCustomersFilter } =
  customersSlice.actions;

export default customersSlice.reducer;
