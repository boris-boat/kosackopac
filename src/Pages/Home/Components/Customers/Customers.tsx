import { useEffect, useState } from "react";
import { supabase } from "../../../../Utils/database";
import {
  SlButton,
  SlDialog,
  SlInput,
} from "@shoelace-style/shoelace/dist/react/index.js";

import "./Customers.styles.css";
import {
  addNewCustomer,
  fetchCustomers,
} from "../../../../redux/slices/customerSlice";
import { useDispatch, useSelector } from "react-redux";

export const Customers = ({ user, setUser }) => {
  const userId = useSelector((state) => state.userData.data.id);
  const customers = useSelector((state) => state.customersData.data);
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({});

  useEffect(() => {
    dispatch(fetchCustomers(userId));
  }, []);

  const handleSetNewCustomerValues = (value: string, label: string) => {
    setNewCustomerData((prev) => ({ ...prev, [label]: value }));
  };

  const handleAddCustomer = async () => {
    dispatch(addNewCustomer({ id: user.id, ...newCustomerData }));
  };

  return (
    <div className="all-customers">
      {customers.map((customer) => (
        <div className="customer" key={customer.id}>
          {customer.name}
        </div>
      ))}
      <SlDialog
        label="Add new customer"
        open={dialogOpen}
        onSlAfterHide={() => setDialogOpen(false)}
      >
        <div className="customer-add-customer-form">
          <SlInput
            label="Name"
            clearable
            onSlInput={(e) =>
              handleSetNewCustomerValues(e.target.value, "name")
            }
          />
          <SlInput
            label="Address"
            clearable
            onSlInput={(e) =>
              handleSetNewCustomerValues(e.target.value, "address")
            }
          />
          <SlInput
            label="Phone"
            clearable
            onSlInput={(e) =>
              handleSetNewCustomerValues(e.target.value, "phone")
            }
          />
        </div>
        <div className="customer-dialog-buttons-wrapper">
          <SlButton
            slot="footer"
            variant="success"
            onClick={() => {
              handleAddCustomer();
              setDialogOpen(false);
            }}
          >
            Confirm
          </SlButton>
          <SlButton
            slot="footer"
            variant="danger"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </SlButton>
        </div>
      </SlDialog>
      <button
        className="customer"
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        ADD NEW CUSTOMER
      </button>
    </div>
  );
};
