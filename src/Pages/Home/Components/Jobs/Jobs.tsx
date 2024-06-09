import "./Jobs.styles.css";

export const Jobs = ({ user }) => {
  return (
    <div className="all-jobs">
      {user.jobs.map((job) => (
        <div className="job" key={job.id}>
          {job.description}
        </div>
      ))}
      <div className="job">+</div>
    </div>
  );
};
