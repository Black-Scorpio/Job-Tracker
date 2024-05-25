import React, { useState, useEffect } from 'react';
import { getJobs } from '../api/jobs';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        console.error('There was an error fetching the job applications!', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Job Applications
      </Typography>
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} lg={4} key={job._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{job.companyName}</Typography>
                <Typography variant="subtitle1">{job.jobTitle}</Typography>
                <Typography variant="body2">Date Applied: {new Date(job.applicationDate).toLocaleDateString()}</Typography>
                <Typography variant="body2">Status: {job.status}</Typography>
                <Typography variant="body2">{job.jobDescription}</Typography>
                <Typography variant="body2">{job.notes}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default JobList;
