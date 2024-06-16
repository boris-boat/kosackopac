import React, { useEffect, useState } from "react";
import "./HomeContent.styles.css";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setFocusedJob } from "../../../../redux/slices/jobSlice";

export const HomeContent = ({ setCurrentPage }) => {
  const userData = useSelector((state) => state.userData.data);
  const customers = useSelector((state) => state.customersData.data);
  const dispatch = useDispatch();
  const [sortedJobs, setSortedJobs] = useState([]);

  useEffect(() => {
    let tmp2 = [...userData.jobs];
    let tmp = tmp2?.sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
    );
    setSortedJobs(tmp);
  }, [userData.jobs]);

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
        <button>TODAY</button>
        <button>TOMORROW</button>
        <div>DATEPICKER</div>
      </div>
      <div className="homepage-all-jobs">
        {sortedJobs?.map((job) => {
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
