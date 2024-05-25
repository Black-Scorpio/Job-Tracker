import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Typography } from '@mui/material';
import { createJob, updateJob, getJob } from '../api/jobs';

const JobForm = ({ jobId, onJobAdded, onCancel }) => {
  const [initialValues, setInitialValues] = useState({
    companyName: '',
    jobTitle: '',
    applicationDate: '',
    jobDescription: '',
    status: 'Applied',
    notes: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (jobId) {
        try {
          const job = await getJob(jobId);
          setInitialValues({
            companyName: job.companyName || '',
            jobTitle: job.jobTitle || '',
            applicationDate: job.applicationDate ? job.applicationDate.split('T')[0] : '',
            jobDescription: job.jobDescription || '',
            status: job.status || 'Applied',
            notes: job.notes || ''
          });
        } catch (error) {
          console.error('There was an error fetching the job!', error);
        }
      } else {
        setInitialValues({
          companyName: '',
          jobTitle: '',
          applicationDate: '',
          jobDescription: '',
          status: 'Applied',
          notes: ''
        });
      }
    };
    fetchJob();
  }, [jobId]);

  const validationSchema = Yup.object({
    companyName: Yup.string().required('Required'),
    jobTitle: Yup.string().required('Required'),
    applicationDate: Yup.date().required('Required'),
    jobDescription: Yup.string(),
    status: Yup.string().required('Required'),
    notes: Yup.string()
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      if (jobId) {
        await updateJob(jobId, values);
        alert('Job application updated successfully');
      } else {
        await createJob(values);
        alert('Job application added successfully');
      }
      resetForm();
      onJobAdded();
    } catch (error) {
      console.error('There was an error submitting the job application!', error);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
      {({ errors, touched, resetForm }) => (
        <Form>
          <Box
            sx={{
              maxWidth: 600,
              margin: '0 auto',
              padding: '20px',
              backgroundColor: '#f4f4f4',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h5" gutterBottom>
              {jobId ? 'Edit Job Application' : 'Add Job Application'}
            </Typography>
            <Field
              name="companyName"
              as={TextField}
              label="Company Name"
              fullWidth
              margin="normal"
              error={touched.companyName && !!errors.companyName}
              helperText={touched.companyName && errors.companyName}
            />
            <Field
              name="jobTitle"
              as={TextField}
              label="Job Title"
              fullWidth
              margin="normal"
              error={touched.jobTitle && !!errors.jobTitle}
              helperText={touched.jobTitle && errors.jobTitle}
            />
            <Field
              name="applicationDate"
              as={TextField}
              type="date"
              label="Application Date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              error={touched.applicationDate && !!errors.applicationDate}
              helperText={touched.applicationDate && errors.applicationDate}
            />
            <Field
              name="jobDescription"
              as={TextField}
              label="Job Description"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              error={touched.jobDescription && !!errors.jobDescription}
              helperText={touched.jobDescription && errors.jobDescription}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Field name="status" as={Select} label="Status">
                <MenuItem value="Applied">Applied</MenuItem>
                <MenuItem value="Interviewing">Interviewing</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Offered">Offered</MenuItem>
              </Field>
            </FormControl>
            <Field
              name="notes"
              as={TextField}
              label="Notes"
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ flexGrow: 1, marginRight: '10px' }}
              >
                {jobId ? 'Update Job' : 'Add Job'}
              </Button>
              {jobId && (
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    resetForm();
                    onCancel();
                  }}
                  sx={{ flexGrow: 1 }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default JobForm;
