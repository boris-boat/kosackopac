import { useEffect, useState } from "react";
import {
  SlButton,
  SlDialog,
  SlInput,
  SlSelect,
} from "@shoelace-style/shoelace/dist/react/index.js";

import "./Customers.styles.css";
import {
  addNewCustomer,
  deleteCustomer,
  editCustomer,
  fetchCustomers,
  setFocusedCustomer,
} from "../../../../redux/slices/customerSlice";
import { useDispatch, useSelector } from "react-redux";

export const Customers = ({ user, setUser }) => {
  const userId = useSelector((state) => state.userData.data.id);
  const customers = useSelector((state) => state.customersData.data);
  const focusedCustomer = useSelector(
    (state) => state.customersData.focusedCustomer
  );
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({});
  const [editCustomerData, setEditCustomerData] = useState(
    focusedCustomer.id ? { ...focusedCustomer } : {}
  );
  const [viewEditCustomerModal, setViewEditCustomerModal] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers(userId));
  }, []);

  const handleSetNewCustomerValues = (value: string, label: string) => {
    setNewCustomerData((prev) => ({ ...prev, [label]: value }));
  };
  const handleSetEditCustomerValues = (value: string, label: string) => {
    setEditCustomerData((prev) => ({ ...prev, [label]: value }));
  };

  const handleEditCustomer = () => {
    dispatch(editCustomer({ ...editCustomerData }));
  };

  const handleAddCustomer = () => {
    dispatch(addNewCustomer({ id: user.id, ...newCustomerData }));
  };

  const handleDeleteCustomer = (id) => {
    dispatch(deleteCustomer(id));
  };

  useEffect(() => {
    setEditCustomerData(focusedCustomer);
  }, [focusedCustomer.id]);

  return (
    <div className="all-customers">
      {customers.map((customer) => (
        <div
          className="customer"
          key={customer?.id}
          onClick={() => {
            dispatch(setFocusedCustomer(customer));
            setViewEditCustomerModal(true);
          }}
        >
          {customer?.name}
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
      {focusedCustomer ? (
        <SlDialog
          label="Edit customer"
          open={viewEditCustomerModal}
          onSlAfterHide={() => setViewEditCustomerModal(false)}
        >
          <div className="customer-add-customer-form">
            <SlInput
              label="Name"
              clearable
              onSlInput={(e) =>
                handleSetEditCustomerValues(e.target.value, "name")
              }
              value={editCustomerData.name}
            />
            <SlInput
              label="Address"
              clearable
              onSlInput={(e) =>
                handleSetEditCustomerValues(e.target.value, "address")
              }
              value={editCustomerData.address}
            />
            <SlInput
              label="Phone"
              clearable
              onSlInput={(e) =>
                handleSetEditCustomerValues(e.target.value, "phone")
              }
              value={editCustomerData.phone}
            />
          </div>
          <div className="customer-dialog-buttons-wrapper">
            <SlButton
              slot="footer"
              variant="success"
              onClick={() => {
                handleEditCustomer();
                setViewEditCustomerModal(false);
              }}
            >
              Confirm
            </SlButton>
            <SlButton
              slot="footer"
              variant="danger"
              onClick={() => {
                handleDeleteCustomer(editCustomerData.id);
                setViewEditCustomerModal(false);
              }}
            >
              Delete
            </SlButton>
            <SlButton
              slot="footer"
              variant="primary"
              onClick={() => setViewEditCustomerModal(false)}
            >
              Cancel
            </SlButton>
          </div>
        </SlDialog>
      ) : null}
    </div>
  );
};
