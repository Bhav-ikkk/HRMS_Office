'use client';
import * as React from 'react';
import { Button, TextField, Grid, Stack, Typography, Snackbar } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function LeaveRequestPage() {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [reason, setReason] = React.useState('');
  const [userId, setUserId] = React.useState(1); // You can replace this with the current user's ID
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send to the API
    const data = { userId, startDate: startDate.toISOString(), endDate: endDate.toISOString(), reason };

    try {
      const res = await fetch('/api/leave/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status === 200) {
        setSuccessMessage('Leave request submitted successfully!');
      } else {
        setError(result.error || 'Something went wrong!');
      }
    } catch (err) {
      setError('Something went wrong with the request');
    }
  };

  return (
    <Stack spacing={3} sx={{ width: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h4">Leave Request</Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Reason for Leave"
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Submit Leave Request
            </Button>
          </Grid>
        </Grid>
      </form>

      {error && (
        <Snackbar
          open={Boolean(error)}
          onClose={() => setError('')}
          message={error}
          autoHideDuration={6000}
        />
      )}

      {successMessage && (
        <Snackbar
          open={Boolean(successMessage)}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
          autoHideDuration={6000}
        />
      )}
    </Stack>
  );
}
