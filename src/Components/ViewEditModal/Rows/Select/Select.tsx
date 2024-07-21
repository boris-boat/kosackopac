import React from "react";
import { SlSelect } from "@shoelace-style/shoelace/dist/react/index.js";
export const Select = () => {
  return (
    <SlSelect
      label="Select customer"
      // onSlInput={(e) =>
      //   setNewJobData((prev) => ({
      //     ...prev,
      //     customer_id: (e.target as SlInputElement).value,
      //   }))
      // }
      // value={newJobData?.customer_id ?? undefined}
    >
      {/* {customers &&
      customers.map((customer) => {
        return (
          <SlOption key={customer.id} value={customer.id}>
            {customer.name}
          </SlOption>
        );
      })} */}
    </SlSelect>
  );
};
