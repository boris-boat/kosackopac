import {
  SlButton,
  SlDialog,
  SlInput,
  SlSelect,
  SlOption,
} from "@shoelace-style/shoelace/dist/react/index.js";
import type SlInputElement from "@shoelace-style/shoelace/dist/components/input/input";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { Select } from "./Rows/Select/Select";
import { Input } from "./Rows/Input/Input";

export const ViewEditModal = ({ onConfirm, onCancel, isOpen, setIsOpen }) => {
  const [modalData, setModalData] = useState({});
  const handleSetNewModalData = (value: string, label: string) => {
    setModalData((prev) => ({ ...prev, [label]: value }));
  };
  return (
    <SlDialog
      label="Add new job"
      open={isOpen}
      onSlRequestClose={() => {
        // setAddJobModalOpen(false);
        // setNewJobData({});
        setIsOpen(false);
      }}
    >
      <Select />
      <Input label="Input 1" />
      <Input label="Input 2" />
      <div className="date-time-picker">
        <span>Pick date and time</span>
        <DatePicker
          className="custom-datepicker"
          // selected={newJobData.scheduledDate ?? date}
          // onChange={(date: Date) => {
          //   setNewJobData((prev) => ({
          //     ...prev,
          //     scheduledDate: date,
          //   }));
          //   setDate(date);
          // }}
          showTimeSelect
          timeIntervals={15}
          timeFormat="HH:mm"
          dateFormat="dd/MM/YYYY HH:mm"
        />
      </div>
      <div className="jobs-dialog-buttons-wrapper">
        <SlButton
          slot="footer"
          variant="success"
          // onClick={() => {
          //   handleSubmitCreateNewJob();
          //   setAddJobModalOpen(false);
          // }}
          // disabled={
          //   !newJobData.description ||
          //   !newJobData.title ||
          //   !newJobData.customer_id
          // }
        >
          Confirm
        </SlButton>
        <SlButton
          slot="footer"
          variant="danger"
          onClick={() => {
            // dispatch(resetFocusedJob());
            // setAddJobModalOpen(false);
            setIsOpen(false);
          }}
        >
          Cancel
        </SlButton>
      </div>
    </SlDialog>
  );
};
