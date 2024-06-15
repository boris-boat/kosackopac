import React from "react";
import "./HomeContent.styles.css";

export const HomeContent = ({ user }) => {
  return (
    <>
      <div className="home-content-filter">
        <button>TODAY</button>
        <button>TOMORROW</button>
        <div>DATEPICKER</div>
      </div>
      <div className="homepage-all-jobs">
        {user.jobs.map((job) => (
          <div className="homepage-job" key={job.id}>
            {job.description ?? job.title}
          </div>
        ))}
      </div>
    </>
  );
};
