import React, { useState, useCallback } from 'react';
import JobForm from '../components/JobForm';
import JobList from '../components/JobList';
import { Box } from '@mui/material';

const Home = () => {
  const [refreshJobs, setRefreshJobs] = useState(0);
  const [editJobId, setEditJobId] = useState(null);

  const handleJobAdded = useCallback(() => {
    setRefreshJobs((prev) => prev + 1);
    setEditJobId(null); 
  }, []);

  const handleEdit = (jobId) => {
    setEditJobId(jobId);
  };

  const handleCancel = () => {
    setEditJobId(null);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        alignItems: 'flex-start', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}
    >
      <Box sx={{ flex: 3, paddingRight: { md: '20px', xs: 0 }, width: '100%' }}>
        <JobList refresh={refreshJobs} onEdit={handleEdit} />
      </Box>
      <Box 
        sx={{ 
          flex: 1, 
          width: { md: '400px', xs: '100%' },
          marginTop: { xs: '20px', md: 0 },
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 3,
          minHeight: 'calc(100vh - 40px)', 
          overflowY: { xs: 'auto', md: 'visible' } 
        }}
      >
        <JobForm jobId={editJobId} onJobAdded={handleJobAdded} onCancel={handleCancel} />
      </Box>
    </Box>
  );
};

export default Home;
