import React from "react";
import { SlInput } from "@shoelace-style/shoelace/dist/react/index.js";
export const Input = ({ label }) => {
  return (
    <SlInput
      label={label}
      clearable
      // onSlInput={(e) =>
      //   handleSetNewJobValues((e.target as SlInputElement).value, "title")
      // }
      // value={newJobData?.title ?? ""}
    />
  );
};
