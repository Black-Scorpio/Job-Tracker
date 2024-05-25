import React from 'react';
import JobForm from '../components/JobForm';
import JobList from '../components/JobList';
import { Box } from '@mui/material'; 

const Home = () => {
  return (
    <Box  sx={{ padding: '20px' }}>
      <JobForm />
      <JobList />
    </Box>
  );
};

export default Home;
