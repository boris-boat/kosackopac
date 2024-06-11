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
export const Jobs = ({ user, setUser }) => {
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({});
  const [customers, setCustomers] = useState();
  const [date, setDate] = useState(new Date());
  const [viewEditJobModal, setViewEditJobModal] = useState(false);
  const [focusedJob, setFocusedJob] = useState(null);
  const [editJobMode, setEditJobMode] = useState(false);
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

  const handleSubmitCreateNewJob = async () => {
    const parsedDate = moment(newJobData.scheduledDate);
    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          title: newJobData.title,
          description: newJobData.description,
          customer_id: newJobData.customer_id,
          registeredUser_id: user.id,
          scheduledDate: parsedDate,
          status: "pending",
        },
      ])
      .select();
    if (!error) {
      setUser((prev) => ({ ...prev, jobs: [...prev.jobs, data[0]] }));
    }
    console.log(error && error);
    setNewJobData(undefined);
  };

  const handleViewEditJob = async (focusedJobId: string) => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", focusedJobId);
    if (error) {
      console.log(error);
      return;
    } else {
      console.log(customers, data);
      // console.log(
      //   customers.find((customer) => customer.id === focusedJob[0].customer_id)
      // );
      setFocusedJob(data[0]);
      setViewEditJobModal(true);
    }
  };

  const handleUpdateJob = async () => {
    console.log(focusedJob);
  };

  return (
    <div className="all-jobs">
      {user.jobs.map((job) => (
        <div
          className="job"
          key={job.id}
          onClick={() => handleViewEditJob(job.id)}
        >
          {job.description ?? job.title}
        </div>
      ))}
      <button className="job" onClick={() => setAddJobModalOpen(true)}>
        ADD NEW JOB
      </button>
      <SlDialog
        label="Dialog"
        open={addJobModalOpen}
        onSlRequestClose={() => {
          setNewJobData({});
        }}
      >
        <SlSelect
          label="Select customer"
          onSlInput={(e) =>
            setNewJobData((prev) => ({ ...prev, customer_id: e.target.value }))
          }
          value={newJobData?.customer_id ?? undefined}
        >
          {customers &&
            customers.map((customer) => {
              return (
                <SlOption key={customer.id} value={customer.id}>
                  {customer.name}
                </SlOption>
              );
            })}
        </SlSelect>

        <SlInput
          label="Title"
          clearable
          onSlInput={(e) => handleSetNewJobValues(e.target.value, "title")}
          value={newJobData?.title ?? ""}
        />
        <SlInput
          label="Description"
          clearable
          onSlInput={(e) =>
            handleSetNewJobValues(e.target.value, "description")
          }
          value={newJobData?.description ?? ""}
        />
        <div className="date-time-picker">
          <span>Pick date and time</span>
          <DatePicker
            className="custom-datepicker"
            selected={newJobData.scheduledDate ?? date}
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
              handleSubmitCreateNewJob();
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
      </SlDialog>{" "}
      {focusedJob ? (
        <SlDialog
          label="Dialog"
          open={viewEditJobModal}
          className="edit-job-dialog"
        >
          <SlSelect
            label="Customer"
            className="edit-job-input"
            onSlInput={(e) =>
              setFocusedJob((prev) => ({
                ...prev,
                customer_id: e.target.value,
              }))
            }
            disabled={!editJobMode}
            value={
              customers.find(
                (customer) => customer.id === focusedJob.customer_id
              ).id
            }
          >
            {customers &&
              customers.map((customer) => {
                return (
                  <SlOption key={customer.id} value={customer.id}>
                    {customer.name}
                  </SlOption>
                );
              })}
          </SlSelect>

          <SlInput
            className="edit-job-input"
            label="Title"
            clearable
            onSlInput={(e) =>
              setFocusedJob((prev) => ({ ...prev, title: e.target.value }))
            }
            value={focusedJob.title}
            disabled={!editJobMode}
          />
          <SlInput
            className="edit-job-input"
            label="Description"
            clearable
            onSlInput={(e) =>
              setFocusedJob((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            value={focusedJob.description}
            disabled={!editJobMode}
          />
          <div className="date-time-picker">
            <span>Date and time</span>
            <DatePicker
              className="custom-datepicker"
              selected={focusedJob.scheduledDate}
              onChange={(date) => {
                setFocusedJob((prev) => ({
                  ...prev,
                  scheduledDate: date,
                }));
                setDate(date);
              }}
              showTimeSelect
              timeIntervals={15}
              timeFormat="HH:mm"
              dateFormat="dd/MM/YYYY HH:mm"
              disabled={!editJobMode}
            />
          </div>
          <div className="jobs-dialog-buttons-wrapper">
            <SlButton
              slot="footer"
              variant={editJobMode ? "primary" : "success"}
              onClick={() => {
                if (editJobMode) {
                  handleUpdateJob();
                  setViewEditJobModal(false);
                } else {
                  setEditJobMode(!editJobMode);
                }
              }}
            >
              {!editJobMode ? "Edit" : "Confirm"}
            </SlButton>
            <SlButton
              slot="footer"
              variant="danger"
              onClick={() => setViewEditJobModal(false)}
            >
              Cancel
            </SlButton>
          </div>
        </SlDialog>
      ) : null}
    </div>
  );
};
