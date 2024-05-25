import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const JobItem = ({ job, selected, onSelect }) => {
  return (
    <Card
      onClick={() => onSelect(job._id)}
      sx={{
        cursor: 'pointer',
        backgroundColor: selected ? '#d3d3d3' : 'white',
      }}
    >
      <CardContent>
        <Typography variant="h6">{job.companyName}</Typography>
        <Typography variant="subtitle1">{job.jobTitle}</Typography>
        <Typography variant="body2">Date Applied: {new Date(job.applicationDate).toLocaleDateString()}</Typography>
        <Typography variant="body2">Status: {job.status}</Typography>
      </CardContent>
    </Card>
  );
};

export default JobItem;
