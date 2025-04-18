'use client';
import * as React from 'react';
import {
  Button,
  TextField,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Container,
  Paper,
  Divider,
  Box
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSession } from 'next-auth/react'; // Import useSession from NextAuth

export default function LeaveRequestPage() {
  const { data: session, status } = useSession(); // Get session data
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [reason, setReason] = React.useState('');
  const [application, setApplication] = React.useState('');
  const [userId, setUserId] = React.useState(null); // Initialize userId
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  // Set userId when session is available
  React.useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUserId(session.user.id);
    } else if (status === 'unauthenticated') {
      setError('You must be logged in to submit a leave request.');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
  }, [session, status]);

  const isValidDateRange = startDate && endDate && startDate < endDate;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User not authenticated.');
      return;
    }

    if (!startDate || !endDate || !reason || !application || !isValidDateRange) {
      setError('Please fill all fields and ensure start date is before end date.');
      return;
    }

    const data = {
      userId, // Use dynamic userId from session
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      reason,
      application,
    };

    try {
      const res = await fetch('/api/leave/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status === 200) {
        setSuccessMessage('Leave request submitted successfully!');
        setError('');
        setReason('');
        setApplication('');
        setStartDate(null);
        setEndDate(null);
      } else {
        setError(result.error || 'Something went wrong!');
      }
    } catch {
      setError('Something went wrong with the request.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ padding: 5, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Leave Application
        </Typography>
        {/* Display the current user's name for clarity */}
        {session?.user?.name && (
          <Typography variant="subtitle1" gutterBottom>
            Submitting as: {session.user.name}
          </Typography>
        )}
        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Reason for Leave
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g., Medical, Personal, Family Emergency"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Application Content
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder="Write your leave application in detail..."
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Start Date & Time
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  disablePast
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                End Date & Time
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  disablePast
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!isValidDateRange || !userId}
                sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
              >
                Submit Leave Request
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}