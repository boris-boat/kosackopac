import React, { useEffect, useState } from "react";
import "./HomeContent.styles.css";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setFocusedJob } from "../../../../redux/slices/jobSlice";
import { fetchCustomers } from "../../../../redux/slices/customerSlice";

export const HomeContent = ({ setCurrentPage }) => {
  const userData = useSelector((state) => state.userData.data);
  const userJobs = useSelector((state) => state.jobsData.jobs);
  const customers = useSelector((state) => state.customersData.data);
  const dispatch = useDispatch();
  const [sortedJobs, setSortedJobs] = useState([]);
  const [filter, setFilter] = useState("today");

  useEffect(() => {
    let tmp2 = [...(userJobs ?? [])];
    let tmp = tmp2?.sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
    );
    setSortedJobs(tmp);
  }, [userJobs]);

  const filterFn = (job) => {
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
        job.title.toLowerCase().includes(filter.toLowerCase()) ||
        job.description.toLowerCase().includes(filter.toLowerCase()) ||
        customerName.includes(filter.toLowerCase())
      );
    }
  };

  const handleSetFocusedJob = (job) => {
    setCurrentPage("JOBS");
    dispatch(
      setFocusedJob({
        ...job,
        scheduledDate: new Date(job.scheduledDate),
      })
    );
  };

  return (
    <>
      <div className="home-content-filter">
        <button
          className={filter === "today" ? "selected" : ""}
          onClick={() => setFilter("today")}
        >
          TODAY
        </button>
        <button
          onClick={() => setFilter("tommorow")}
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
        {sortedJobs?.filter(filterFn).map((job) => {
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
                  <span>{moment(job.scheduledDate).format("LLLL")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
