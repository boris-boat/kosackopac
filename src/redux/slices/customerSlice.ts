import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../Utils/database";
import { fetchUser } from "./userSlice";
import { toast } from "react-toastify";

const initialState = {
  data: [],
  focusedCustomer: {},
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

export const editCustomer = createAsyncThunk(
  "customers/editCustomer",
  async (editCustomerData) => {
    const { data, error } = await supabase
      .from("customers")
      .update(editCustomerData)
      .eq("id", editCustomerData.id)
      .select();
    return data[0];
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, { dispatch }) => {
    await supabase.from("customers").delete().eq("id", id);
    dispatch(fetchUser());
    return id;
  }
);

export const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers: (state, action) => (state.userData = action.payload),
    setFocusedCustomer: (state, action) => {
      state.focusedCustomer = action.payload;
    },
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
