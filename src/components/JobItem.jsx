import React from 'react';

const JobItem = ({ job }) => {
  return (
    <div>
      <h3>{job.companyName}</h3>
      <p>{job.jobTitle}</p>
      <p>{new Date(job.applicationDate).toLocaleDateString()}</p>
      <p>{job.status}</p>
      <p>{job.jobDescription}</p>
      <p>{job.notes}</p>
    </div>
  );
};

export default JobItem;
