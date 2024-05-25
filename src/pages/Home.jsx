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
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{ flex: 3, paddingRight: '20px' }}>
        <JobList refresh={refreshJobs} onEdit={handleEdit} />
      </Box>
      <Box 
        sx={{ 
          flex: 1, 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          width: '500px',
        }}
      >
        <JobForm jobId={editJobId} onJobAdded={handleJobAdded} onCancel={handleCancel} />
      </Box>
    </Box>
  );
};

export default Home;
