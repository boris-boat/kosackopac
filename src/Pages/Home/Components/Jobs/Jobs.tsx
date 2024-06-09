import { useEffect, useState } from "react";
import "./Jobs.styles.css";
import moment from "moment";
import {
  SlButton,
  SlDialog,
  SlInput,
  SlSelect,
  SlOption,
} from "@shoelace-style/shoelace/dist/react/index.js";
import { supabase } from "../../../../Utils/database";
import DatePicker from "react-datepicker";
export const Jobs = ({ user }) => {
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({});
  const [customers, setCustomers] = useState();
  const [date, setDate] = useState(new Date());
  const handleSetNewJobValues = (value, label) => {
    setNewJobData((prev) => ({ ...prev, [label]: value }));
  };

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

  const handleSubmit = async () => {
    const parsedDate = moment(newJobData.scheduledDate);
    const { data, error } = await supabase.from("jobs").insert([
      {
        title: newJobData.title,
        description: newJobData.description,
        customer_id: newJobData.customer_id,
        registeredUser_id: user.id,
        scheduledDate: parsedDate.add(2, "hours"),
        status: "pending",
      },
    ]);
    console.log(error ? error : data);
  };
  return (
    <div className="all-jobs">
      {user.jobs.map((job) => (
        <div className="job" key={job.id}>
          {job.description}
        </div>
      ))}
      <SlDialog label="Dialog" open={addJobModalOpen}>
        <SlSelect
          label="Select customer"
          onSlInput={(e) =>
            setNewJobData((prev) => ({ ...prev, customer_id: e.target.value }))
          }
        >
          {customers &&
            customers.map((customer) => {
              return <SlOption value={customer.id}>{customer.name}</SlOption>;
            })}
        </SlSelect>

        <SlInput
          label="Title"
          clearable
          onSlInput={(e) => handleSetNewJobValues(e.target.value, "title")}
        />
        <SlInput
          label="Description"
          clearable
          onSlInput={(e) =>
            handleSetNewJobValues(e.target.value, "description")
          }
        />
        <div className="date-time-picker">
          <span>Pick date and time</span>
          <DatePicker
            className="custom-datepicker"
            selected={date}
            onChange={(date) => {
              setNewJobData((prev) => ({
                ...prev,
                scheduledDate: date,
              }));
              setDate(date);
            }}
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
            onClick={() => {
              handleSubmit();
              setAddJobModalOpen(false);
            }}
          >
            Confirm
          </SlButton>
          <SlButton
            slot="footer"
            variant="danger"
            onClick={() => setAddJobModalOpen(false)}
          >
            Cancel
          </SlButton>
        </div>
      </SlDialog>
      <button className="job" onClick={() => setAddJobModalOpen(true)}>
        ADD NEW JOB
      </button>
    </div>
  );
};
