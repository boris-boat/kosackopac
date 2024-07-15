import React, { useEffect, useState } from "react";
import "./HomeContent.styles.css";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setFocusedJob } from "../../../../redux/slices/jobSlice";
import { IReduxStoreRootState } from "../../../../redux/types/storeType";
import { IJob } from "../../../../redux/types/jobsTypes";

export const HomeContent = ({
  setCurrentPage,
}: {
  setCurrentPage: React.Dispatch<
    React.SetStateAction<"HOME" | "ALL JOBS" | "CUSTOMERS">
  >;
}) => {
  const userJobs = useSelector(
    (state: IReduxStoreRootState) => state.jobsData.jobs
  );
  const customers = useSelector(
    (state: IReduxStoreRootState) => state.customersData.data
  );
  const dispatch = useDispatch();
  const [sortedJobs, setSortedJobs] = useState<IJob[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const tmp2 = [...(userJobs ?? [])];
    const tmp = tmp2?.sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
    );
    setSortedJobs(tmp);
  }, [userJobs]);

  const filterFn = (job: IJob) => {
    const customer = customers?.find(
      (customer) => customer.id === job.customer_id
    );
    const customerName = customer ? customer.name.toLowerCase() : "";
    if (filter === "today") {
      return (
        new Date().toISOString().split("T")[0] ===
        job.scheduledDate.split("T")[0]
      );
    }
    if (filter === "tommorow") {
      return (
        moment(new Date()).add(1, "days").format("LL") ===
        moment(job.scheduledDate).format("LL")
      );
    } else {
      return (
        moment(job.scheduledDate).isSameOrAfter(moment(), "day") &&
        (job.title.toLowerCase().includes(filter.toLowerCase()) ||
          job.description.toLowerCase().includes(filter.toLowerCase()) ||
          customerName.includes(filter.toLowerCase()))
      );
    }
  };

  const handleSetFocusedJob = (job: IJob) => {
    setCurrentPage("ALL JOBS");
    dispatch(
      setFocusedJob({
        ...job,
        scheduledDate: new Date(job.scheduledDate).toISOString(),
      })
    );
  };

  return (
    <>
      <div className="home-content-filter">
        <button
          className={filter === "today" ? "selected" : ""}
          onClick={() => {
            setFilter((prev) => (prev === "today" ? "" : "today"));
          }}
        >
          TODAY
        </button>
        <button
          onClick={() => {
            setFilter((prev) => (prev === "tommorow" ? "" : "tommorow"));
          }}
          className={filter === "tommorow" ? "selected" : ""}
        >
          TOMORROW
        </button>
        <div className="input-filter">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setFilter(e.target.value)}
            onBlur={(event) => {
              event.target.value = "";
            }}
          />
        </div>
      </div>
      <div className="homepage-all-jobs">
        {sortedJobs?.filter(filterFn).map((job: IJob) => {
          return (
            <div
              className="job"
              key={job.id}
              onClick={() => handleSetFocusedJob(job)}
            >
              <div className="job-description">
                <p>
                  {
                    customers?.find(
                      (customer) => customer.id === job.customer_id
                    )?.name
                  }
                </p>
                <div className="second-row">
                  <span>{job.description ?? job.title}</span>
                  <span>{moment(job.scheduledDate).format("llll")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
