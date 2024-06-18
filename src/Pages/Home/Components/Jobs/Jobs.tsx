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
import { useDispatch, useSelector } from "react-redux";
import {
  addNewJob,
  deleteJob,
  resetFocusedJob,
  setFocusedJob,
  updateJob,
} from "../../../../redux/slices/jobSlice";
import { daysAheadOptions } from "../../../../Utils/daysAheadOptions";

export const Jobs = () => {
  const userData = useSelector((state) => state.userData.userData);
  const userJobs = useSelector((state) => state.jobsData.jobs);

  const customers = useSelector((state) => state.customersData.data);
  const focusedJob = useSelector((state) => state.jobsData.data.focusedJob);
  const dispatch = useDispatch();
  const [sortedJobs, setSortedJobs] = useState([]);

  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({});
  const [date, setDate] = useState(new Date());
  const [viewEditJobModal, setViewEditJobModal] = useState(
    focusedJob ? true : false
  );
  const [editJobMode, setEditJobMode] = useState(false);
  const [daysAhead, setDaysAhead] = useState();

  const handleSetNewJobValues = (value, label) => {
    setNewJobData((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmitCreateNewJob = async () => {
    const parsedDate = newJobData.scheduledDate ?? new Date();
    dispatch(
      addNewJob({ registeredUser_id: userData.id, parsedDate, ...newJobData })
    );
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
      dispatch(
        setFocusedJob({
          ...data[0],
          scheduledDate: new Date(data[0].scheduledDate),
        })
      );
      setViewEditJobModal(true);
    }
  };

  const handleUpdateJob = async () => {
    dispatch(updateJob(focusedJob));
    setEditJobMode(false);
    setViewEditJobModal(false);
  };

  const handleDeleteJob = async (id) => {
    dispatch(deleteJob(id));
    setViewEditJobModal(false);
    dispatch(resetFocusedJob());
  };

  const handleAddNewJobIn = () => {
    let focusedJobDateParsed = moment(focusedJob.scheduledDate);
    let newDate = new Date(
      focusedJobDateParsed.clone().add(Number(daysAhead), "days")
    );
    dispatch(addNewJob({ ...focusedJob, id: undefined, parsedDate: newDate }));
    setDaysAhead(undefined);
    setViewEditJobModal(false);
  };

  useEffect(() => {
    let tmp2 = [...(userJobs ?? [])];
    let tmp = tmp2?.sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
    );
    setSortedJobs(tmp);
  }, [userJobs]);

  return (
    <div className="all-jobs">
      {sortedJobs.map((job) => {
        return (
          <div
            className="job"
            key={job.id}
            onClick={() => handleViewEditJob(job.id)}
          >
            <div className="job-description">
              <div className="first-row">
                <span>
                  {
                    customers?.find(
                      (customer) => customer?.id === job?.customer_id
                    )?.name
                  }
                </span>
                <span>{job.title}</span>
              </div>
              <div className="second-row">
                <span>{job.description}</span>
                <span>
                  {moment(job.scheduledDate).format("ddd DD.MM.YY HH:MM")}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <button className="job" onClick={() => setAddJobModalOpen(true)}>
        ADD NEW JOB
      </button>
      <SlDialog
        label="Dialog"
        open={addJobModalOpen}
        onSlRequestClose={() => {
          setAddJobModalOpen(false);
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
            onClick={() => {
              dispatch(resetFocusedJob());
              setAddJobModalOpen(false);
            }}
          >
            Cancel
          </SlButton>
        </div>
      </SlDialog>
      {focusedJob.id ? (
        <SlDialog
          onSlRequestClose={() => {
            dispatch(resetFocusedJob());
            setViewEditJobModal(false);
          }}
          label="Job info"
          open={viewEditJobModal}
          className="edit-job-dialog"
        >
          {!editJobMode && (
            <div className="new-job-creator">
              <SlSelect
                label="Create new job in"
                onSlInput={(e) => {
                  setDaysAhead(e.target.value);
                }}
                value={daysAhead}
              >
                {daysAheadOptions.map((option) => {
                  return (
                    <SlOption key={option.value} value={String(option.value)}>
                      {option.label}
                    </SlOption>
                  );
                })}
              </SlSelect>
              <SlButton
                variant="success"
                onClick={() => handleAddNewJobIn(daysAhead)}
              >
                Confirm
              </SlButton>
            </div>
          )}
          <SlSelect
            label="Customer"
            className="edit-job-input"
            onSlInput={(e) =>
              dispatch(setFocusedJob({ customer_id: e.target.value }))
            }
            disabled={!editJobMode}
            value={
              customers.find(
                (customer) => customer.id === focusedJob.customer_id
              )?.id
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
              dispatch(setFocusedJob({ title: e.target.value }))
            }
            value={focusedJob.title}
            disabled={!editJobMode}
          />
          <SlInput
            className="edit-job-input"
            label="Description"
            clearable
            onSlInput={(e) =>
              dispatch(setFocusedJob({ description: e.target.value }))
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
                dispatch(setFocusedJob({ scheduledDate: date }));
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
              onClick={() => {
                setEditJobMode(false);
                dispatch(resetFocusedJob());
                setViewEditJobModal(false);
              }}
            >
              Cancel
            </SlButton>
          </div>
        </SlDialog>
      ) : null}
    </div>
  );
};
