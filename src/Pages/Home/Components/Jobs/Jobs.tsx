import { useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  addNewJob,
  deleteJob,
  updateJob,
} from "../../../../redux/slices/jobSlice";
export const Jobs = ({ setUser }) => {
  const userData = useSelector((state) => state.userData.data);
  const customers = useSelector((state) => state.customersData.data);
  const dispatch = useDispatch();

  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({});
  const [date, setDate] = useState(new Date());
  const [viewEditJobModal, setViewEditJobModal] = useState(false);
  const [focusedJob, setFocusedJob] = useState(null);
  const [editJobMode, setEditJobMode] = useState(false);

  const handleSetNewJobValues = (value, label) => {
    setNewJobData((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmitCreateNewJob = async () => {
    const parsedDate = newJobData.scheduledDate;
    dispatch(addNewJob({ id: userData.id, parsedDate, ...newJobData }));
    setNewJobData({});
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
      setFocusedJob({
        ...data[0],
        scheduledDate: new Date(data[0].scheduledDate),
      });
      setViewEditJobModal(true);
    }
  };

  const handleUpdateJob = async () => {
    dispatch(updateJob(focusedJob));
    setEditJobMode(false);
  };

  const handleDeleteJob = async (id) => {
    dispatch(deleteJob(id));
    setViewEditJobModal(false);
  };
  return (
    <div className="all-jobs">
      {userData.jobs.map((job) => (
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
      </SlDialog>
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
              onClick={() => handleDeleteJob(focusedJob.id)}
            >
              Delete
            </SlButton>
            <SlButton
              slot="footer"
              variant="primary"
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
