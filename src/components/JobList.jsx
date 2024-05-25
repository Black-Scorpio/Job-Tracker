import React, { useState, useEffect } from 'react';
import { getJobs, deleteJob } from '../api/jobs';
import JobItem from './JobItem';
import { Box, Typography, Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isWithinInterval } from 'date-fns';

const JobList = ({ onEdit, refresh }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);

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
  }, [refresh]);

  const handleSelect = (id) => {
    setSelectedJobs((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((jobId) => jobId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDelete = async () => {
    const jobToDelete = selectedJobs.length === 1 ? jobs.find(job => job._id === selectedJobs[0]) : null;
    const confirmationMessage = selectedJobs.length === 1 ? `Are you sure you want to delete ${jobToDelete.companyName} - ${jobToDelete.jobTitle}?` : `Are you sure you want to delete ${selectedJobs.length} jobs?`;
    if (window.confirm(confirmationMessage)) {
      try {
        for (const id of selectedJobs) {
          await deleteJob(id);
        }
        setJobs((prevJobs) => prevJobs.filter((job) => !selectedJobs.includes(job._id)));
        setSelectedJobs([]);
      } catch (error) {
        console.error('There was an error deleting the job applications!', error);
      }
    }
  };

  const handleJobDetails = () => {
    if (selectedJobs.length === 1) {
      const job = jobs.find(job => job._id === selectedJobs[0]);
      setJobDetails(job);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setJobDetails(null);
  };

  const filteredJobs = jobs
    .filter(job => job.jobTitle.toLowerCase().includes(titleFilter.toLowerCase()))
    .filter(job => job.companyName.toLowerCase().includes(companyFilter.toLowerCase()))
    .filter(job => statusFilter ? job.status === statusFilter : true)
    .filter(job => {
      if (!startDate || !endDate) return true;
      return isWithinInterval(new Date(job.applicationDate), { start: startDate, end: endDate });
    });

  const datePickerStyle = {
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    backgroundColor: 'white'
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Job Applications
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <TextField
          label="Job Title"
          variant="outlined"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          sx={{ marginRight: '16px', flex: 1, backgroundColor: 'white' }}
        />
        <TextField
          label="Company Name"
          variant="outlined"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          sx={{ marginRight: '16px', flex: 1, backgroundColor: 'white' }}
        />
        <FormControl sx={{ marginRight: '16px', flex: 1, backgroundColor: 'white' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Interviewing">Interviewing</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Offered">Offered</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: '16px', flex: 2 }}>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            customInput={<TextField variant="outlined" />}
            wrapperClassName="datePicker"
            style={datePickerStyle}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
            customInput={<TextField variant="outlined" />}
            wrapperClassName="datePicker"
            style={datePickerStyle}
          />
        </Box>
      </Box>
      <Typography variant="body2" sx={{ marginBottom: '16px' }}>
        {startDate || endDate ? `Showing jobs from ${startDate ? format(startDate, 'MM/dd/yyyy') : 'the beginning'} to ${endDate ? format(endDate, 'MM/dd/yyyy') : 'now'}` : 'Showing all jobs'}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleJobDetails}
        disabled={selectedJobs.length !== 1}
        sx={{ marginBottom: '20px' }}
      >
        Job Details
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onEdit(selectedJobs[0])}
        disabled={selectedJobs.length !== 1}
        sx={{ marginBottom: '20px', marginLeft: '10px' }}
      >
        Edit Job
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDelete}
        disabled={selectedJobs.length === 0}
        sx={{ marginBottom: '20px', marginLeft: '10px' }}
      >
        Delete Selected
      </Button>
      <Grid container spacing={3}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={job._id}>
            <JobItem
              job={job}
              selected={selectedJobs.includes(job._id)}
              onSelect={handleSelect}
            />
          </Grid>
        ))}
      </Grid>

      {jobDetails && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Job Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <strong>Company Name:</strong> {jobDetails.companyName} <br />
              <strong>Job Title:</strong> {jobDetails.jobTitle} <br />
              <strong>Application Date:</strong> {new Date(jobDetails.applicationDate).toLocaleDateString()} <br />
              <strong>Status:</strong> {jobDetails.status} <br />
              <strong>Job Description:</strong> {jobDetails.jobDescription} <br />
              <strong>Notes:</strong> {jobDetails.notes} <br />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default JobList;
