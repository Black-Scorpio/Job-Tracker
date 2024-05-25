import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Typography } from '@mui/material';
import { createJob } from '../api/jobs';

const JobForm = () => {
  const initialValues = {
    companyName: '',
    jobTitle: '',
    applicationDate: '',
    jobDescription: '',
    status: 'Applied',
    notes: ''
  };

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
      await createJob(values);
      alert('Job application added successfully');
      resetForm();
    } catch (error) {
      console.error('There was an error adding the job application!', error);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched }) => (
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
              Add Job Application
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: '20px' }}
            >
              Add Job
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default JobForm;
