'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import axios from 'axios';

const TimeStatusPage = () => {
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTodayTrace = async () => {
    const res = await axios.get('/api/trace/today');
    setTrace(res.data);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await axios.post('/api/trace/login');
      await fetchTodayTrace();
    } catch (error) {
      alert(error.response?.data?.error || 'Error while logging in');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/trace/logout');
      await fetchTodayTrace();
    } catch (error) {
      alert(error.response?.data?.error || 'Error while logging out');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodayTrace();
  }, []);

  return (
    <Stack spacing={4} sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" textAlign="center">
        Time Status
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">Today’s Record</Typography>
          <Typography>Login: {trace?.loginAt ? new Date(trace.loginAt).toLocaleTimeString() : 'Not Logged In'}</Typography>
          <Typography>Logout: {trace?.logoutAt ? new Date(trace.logoutAt).toLocaleTimeString() : 'Not Logged Out'}</Typography>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          color="success"
          onClick={handleLogin}
          disabled={loading || trace?.logoutAt === null}
        >
          Start Work
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          disabled={loading || !trace || trace?.logoutAt !== null}
        >
          End Work
        </Button>
      </Stack>
    </Stack>
  );
};

export default TimeStatusPage;
