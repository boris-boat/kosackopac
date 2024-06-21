import { useContext, useEffect, useState } from "react";
import {
  SlButton,
  SlDialog,
  SlInput,
} from "@shoelace-style/shoelace/dist/react/index.js";

import "./Customers.styles.css";
import {
  addNewCustomer,
  deleteCustomer,
  editCustomer,
  setFocusedCustomer,
} from "../../../../redux/slices/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { ICustomer } from "../../../../redux/types/customerTypes";
import { IReduxStoreRootState } from "../../../../redux/types/storeType";
import { LoadingContext } from "../../../../Context/LoadingContext/LoadingContext";

export const Customers = () => {
  const customerFilter: string = useSelector(
    (state: IReduxStoreRootState) => state.customersData.filter
  );
  const userData = useSelector(
    (state: IReduxStoreRootState) => state.userData.userData
  );
  const customers = useSelector(
    (state: IReduxStoreRootState) => state.customersData.data
  );
  const focusedCustomer: ICustomer = useSelector(
    (state: IReduxStoreRootState) => state.customersData.focusedCustomer
  );
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({});
  const [editCustomerData, setEditCustomerData] = useState(
    focusedCustomer.id ? { ...focusedCustomer } : {}
  );
  const [viewEditCustomerModal, setViewEditCustomerModal] = useState(false);
  const { startLoading, stopLoading } = useContext(LoadingContext);

  const handleSetNewCustomerValues = (value: string, label: string) => {
    setNewCustomerData((prev) => ({ ...prev, [label]: value }));
  };
  const handleSetEditCustomerValues = (value: string, label: string) => {
    setEditCustomerData((prev) => ({ ...prev, [label]: value }));
  };

  const handleEditCustomer = () => {
    startLoading();
    dispatch(editCustomer({ ...editCustomerData }));
    stopLoading();
  };

  const handleAddCustomer = () => {
    startLoading();
    dispatch(addNewCustomer({ id: userData.id, ...newCustomerData }));
    setNewCustomerData({});
    stopLoading();
  };

  const handleDeleteCustomer = (id) => {
    startLoading();
    dispatch(deleteCustomer(id));
    stopLoading();
  };

  useEffect(() => {
    setEditCustomerData(focusedCustomer);
  }, [focusedCustomer.id]);

  return (
    <div className="all-customers">
      {customers
        .filter((customer) => {
          if (customerFilter) {
            return customer.name.toLowerCase().includes(customerFilter);
          } else return customer;
        })
        .map((customer) => (
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
            value={newCustomerData?.name ?? ""}
          />
          <SlInput
            label="Address"
            clearable
            onSlInput={(e) =>
              handleSetNewCustomerValues(e.target.value, "address")
            }
            value={newCustomerData?.address ?? ""}
          />
          <SlInput
            label="Phone"
            clearable
            onSlInput={(e) =>
              handleSetNewCustomerValues(e.target.value, "phone")
            }
            value={newCustomerData?.phone ?? ""}
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
            disabled={
              !newCustomerData.name ||
              !newCustomerData.address ||
              !newCustomerData.phone
            }
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
