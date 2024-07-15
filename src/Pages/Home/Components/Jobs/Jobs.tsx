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
import type SlInputElement from "@shoelace-style/shoelace/dist/components/input/input";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewJob,
  deleteJob,
  resetFocusedJob,
  setFocusedJob,
  updateJob,
} from "../../../../redux/slices/jobSlice";
import { daysAheadOptions } from "../../../../Utils/daysAheadOptions";
import { IReduxStoreRootState } from "../../../../redux/types/storeType";
import { IJob } from "../../../../redux/types/jobsTypes";
import { useConfirm } from "../../../../Utils/Custom Hooks/UseConfirm/useConfirm";

export const Jobs = () => {
  const userData = useSelector(
    (state: IReduxStoreRootState) => state.userData.userData
  );
  const userJobs = useSelector(
    (state: IReduxStoreRootState) => state.jobsData.jobs
  );
  const jobsFilter = useSelector(
    (state: IReduxStoreRootState) => state.jobsData.filter
  );

  const customers = useSelector(
    (state: IReduxStoreRootState) => state.customersData.data
  );
  const focusedJob = useSelector(
    (state: IReduxStoreRootState) => state.jobsData.data.focusedJob
  );
  const emptyNewJobData = {
    customer_id: "",
    title: "",
    description: "",
    dateScheduled: "",
  };
  const dispatch = useDispatch();
  const { show, ConfirmModal } = useConfirm();
  const [sortedJobs, setSortedJobs] = useState<IJob[]>([]);

  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState<typeof emptyNewJobData | any>(
    emptyNewJobData
  );
  const [date, setDate] = useState(new Date());
  const [viewEditJobModal, setViewEditJobModal] = useState(
    focusedJob ? true : false
  );
  const [editJobMode, setEditJobMode] = useState(false);
  const [daysAhead, setDaysAhead] = useState();
  const [daysAheadRepeatedTimes, setDaysAheadRepeatedTimes] = useState(1);

  const handleSetNewJobValues = (value: string, label: string) => {
    setNewJobData((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmitCreateNewJob = async () => {
    const parsedDate = (newJobData as IJob).scheduledDate ?? new Date();
    dispatch(
      addNewJob({ registeredUser_id: userData.id, parsedDate, ...newJobData })
    );
    setNewJobData({});
  };

  const handleViewEditJob = async (focusedJobId: string) => {
    const { data, error } = await supabase
      .from(import.meta.env.VITE_JOBS_DATABASE)
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

  const handleDeleteJob = async (id: string) => {
    const confirmed = await show();
    if (confirmed) {
      dispatch(deleteJob(id));
      setViewEditJobModal(false);
      dispatch(resetFocusedJob());
    }
  };

  const handleAddNewJobIn = () => {
    const focusedJobDateParsed = moment(focusedJob.scheduledDate);
    for (let i = 1; i <= daysAheadRepeatedTimes; i++) {
      const newDate = new Date(
        focusedJobDateParsed.clone().add(i * daysAhead, "days")
      );

      dispatch(
        addNewJob({ ...focusedJob, id: undefined, parsedDate: newDate })
      );
    }
    setDaysAhead(undefined);
    setViewEditJobModal(false);
    setDaysAheadRepeatedTimes(1);
  };

  const filterFn = (job: IJob) => {
    return (
      job.title.toLowerCase().includes(jobsFilter.toLowerCase()) ||
      job.description.toLowerCase().includes(jobsFilter.toLowerCase())
    );
  };

  useEffect(() => {
    const tmp2 = [...(userJobs ?? [])];
    const tmp = tmp2?.sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
    );
    setSortedJobs(tmp);
  }, [userJobs]);
  const focusedCustomerAddress =
    customers.find((customer) => customer.id === focusedJob.customer_id)
      ?.address ?? "";

  return (
    <div className="all-jobs">
      {sortedJobs?.filter(filterFn)?.map((job) => {
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
                <span>{moment(job.scheduledDate).format("llll")}</span>
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
            setNewJobData((prev) => ({
              ...prev,
              customer_id: (e.target as SlInputElement).value,
            }))
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
          onSlInput={(e) =>
            handleSetNewJobValues((e.target as SlInputElement).value, "title")
          }
          value={newJobData?.title ?? ""}
        />
        <SlInput
          label="Description"
          clearable
          onSlInput={(e) =>
            handleSetNewJobValues(
              (e.target as SlInputElement).value,
              "description"
            )
          }
          value={newJobData?.description ?? ""}
        />
        <div className="date-time-picker">
          <span>Pick date and time</span>
          <DatePicker
            className="custom-datepicker"
            selected={newJobData.scheduledDate ?? date}
            onChange={(date: Date) => {
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
            disabled={
              !newJobData.description ||
              !newJobData.title ||
              !newJobData.customer_id
            }
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
                label="Create new job"
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
              <SlInput
                label="Repeat"
                type="number"
                defaultValue="1"
                value={String(daysAheadRepeatedTimes)}
                onSlChange={(e) => setDaysAheadRepeatedTimes(e.target.value)}
              ></SlInput>
              <SlButton
                variant="success"
                onClick={() => handleAddNewJobIn()}
                disabled={!daysAhead}
              >
                Confirm
              </SlButton>
            </div>
          )}
          <SlSelect
            label="Customer"
            className="edit-job-input"
            onSlInput={(e) =>
              dispatch(
                setFocusedJob({
                  customer_id: (e.target as SlInputElement).value,
                })
              )
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
              dispatch(
                setFocusedJob({ title: (e.target as SlInputElement).value })
              )
            }
            value={focusedJob.title}
            disabled={!editJobMode}
          />
          <SlInput
            className="edit-job-input"
            label="Description"
            clearable
            onSlInput={(e) =>
              dispatch(
                setFocusedJob({
                  description: (e.target as SlInputElement).value,
                })
              )
            }
            value={focusedJob.description}
            disabled={!editJobMode}
          />
          <div className="date-time-picker">
            <div className="left">
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
            {!editJobMode && focusedCustomerAddress ? (
              <a
                href={`https://www.google.com/maps/place/${focusedCustomerAddress}`}
                target="_blank"
              >
                Map
              </a>
            ) : null}
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
      <ConfirmModal caption="Are you sure you want to delete this job?" />
    </div>
  );
};
