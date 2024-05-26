import React, { useState, useEffect } from 'react';
import { getJobs, deleteJob } from '../api/jobs';
import JobItem from './JobItem';
import { Box, Typography, Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel, DialogActions } from '@mui/material';
import { format, subDays, startOfToday, startOfYesterday, isWithinInterval, endOfToday, subMonths } from 'date-fns';
import { CSVLink } from 'react-csv';

const JobList = ({ onEdit, refresh }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState('All (Dates)');
  const [selectAll, setSelectAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);
  const fields = ['companyName', 'jobTitle', 'applicationDate', 'status', 'jobDescription', 'notes'];

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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(job => job._id));
    }
    setSelectAll(!selectAll);
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

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleExportClose = () => {
    setExportDialogOpen(false);
  };

  const handleExportConfirm = () => {
    const dataToExport = selectedJobs.map(id => {
      const job = jobs.find(job => job._id === id);
      const selectedData = {};
      selectedFields.forEach(field => {
        selectedData[field] = job[field];
      });
      return selectedData;
    });

    setExportDialogOpen(false);
  };

  const handleFieldChange = (event) => {
    const { value } = event.target;
    setSelectedFields(typeof value === 'string' ? value.split(',') : value);
  };

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'Today':
        return { start: startOfToday(), end: endOfToday() };
      case 'Yesterday':
        return { start: startOfYesterday(), end: endOfToday() };
      case 'Last 7 Days':
        return { start: subDays(now, 7), end: now };
      case 'Last 14 Days':
        return { start: subDays(now, 14), end: now };
      case 'Last Month':
        return { start: subMonths(now, 1), end: now };
      default:
        return { start: new Date(0), end: now };
    }
  };

  const { start, end } = getDateRange();

  const filteredJobs = jobs
    .filter(job => job.jobTitle.toLowerCase().includes(titleFilter.toLowerCase()))
    .filter(job => job.companyName.toLowerCase().includes(companyFilter.toLowerCase()))
    .filter(job => statusFilter ? job.status === statusFilter : true)
    .filter(job => isWithinInterval(new Date(job.applicationDate), { start, end }))
    .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)); // Sort by date

  return (
    <Box className="job-list">
      <Typography variant="h4" gutterBottom>
        Job Applications
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <TextField
          label="Job Title"
          variant="outlined"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          sx={{ marginRight: '16px', flex: 1, backgroundColor: 'white', minWidth: '150px' }}
        />
        <TextField
          label="Company Name"
          variant="outlined"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          sx={{ marginRight: '16px', flex: 1, backgroundColor: 'white', minWidth: '150px' }}
        />
        <FormControl sx={{ marginRight: '16px', flex: 1, backgroundColor: 'white', minWidth: '150px' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
            autoWidth
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Interviewing">Interviewing</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Offered">Offered</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1, backgroundColor: 'white', minWidth: '150px' }}>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            displayEmpty
            label="Date Range"
            autoWidth
          >
            <MenuItem value="All (Dates)"><em>All (Dates)</em></MenuItem>
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="Yesterday">Yesterday</MenuItem>
            <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
            <MenuItem value="Last 14 Days">Last 14 Days</MenuItem>
            <MenuItem value="Last Month">Last Month</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <FormControlLabel
        control={<Checkbox checked={selectAll} onChange={handleSelectAll} />}
        label="Select All"
      />
      <Typography variant="body2" sx={{ marginBottom: '16px' }}>
        {dateRange === 'All (Dates)' || dateRange === ''
          ? 'Showing all jobs'
          : `Showing jobs from ${format(start, 'MM/dd/yyyy')} to ${format(end, 'MM/dd/yyyy')}`}
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: '16px' }}>
        {selectedJobs.length} job(s) selected
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleExport}
        disabled={selectedJobs.length === 0}
        sx={{ marginBottom: '20px', marginLeft: '10px' }}
      >
        Export
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

      <Dialog open={exportDialogOpen} onClose={handleExportClose}>
        <DialogTitle>Export Jobs</DialogTitle>
        <DialogContent>
          <DialogContentText>Select fields to include in the CSV file:</DialogContentText>
          <FormControl sx={{ width: '100%', marginTop: 2 }}>
            <InputLabel>Fields</InputLabel>
            <Select
              multiple
              value={selectedFields}
              onChange={handleFieldChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {fields.map((field) => (
                <MenuItem key={field} value={field}>
                  <Checkbox checked={selectedFields.indexOf(field) > -1} />
                  <Typography>{field}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportClose}>Cancel</Button>
          <CSVLink
            data={selectedJobs.map(id => {
              const job = jobs.find(job => job._id === id);
              const selectedData = {};
              selectedFields.forEach(field => {
                selectedData[field] = job[field];
              });
              return selectedData;
            })}
            filename="job_applications.csv"
            onClick={handleExportConfirm}
          >
            <Button variant="contained" color="primary">Export</Button>
          </CSVLink>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobList;
