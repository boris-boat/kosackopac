import { useEffect, useState } from "react";
import { supabase } from "../../../../Utils/database";
import {
  SlButton,
  SlDialog,
  SlInput,
} from "@shoelace-style/shoelace/dist/react/index.js";

import "./Customers.styles.css";
export const Customers = ({ user }) => {
  const [customers, setCustomers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({});

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("registeredUsers_id", user.id);
      setCustomers(data);
    };
    getData();
  }, []);

  const handleSetNewCustomerValues = (value: string, label: string) => {
    console.log(value, label);
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
            onClick={() => setDialogOpen(false)}
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
