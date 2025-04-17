'use client';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  TextField,
  Typography,
  CircularProgress,
  Fade,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [snackbar, setSnackbar] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        department: session.user.department || '',
      });
      setLoading(false);
    }
  }, [session]);

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setEdit(false);
    setSnackbar('Profile updated successfully!');
    // 🔄 Optionally send updated data to the server here
  };

  if (status === 'loading' || loading) {
    return <CircularProgress sx={{ m: 5 }} />;
  }

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          background: 'radial-gradient(circle at top left, #1976d2, #0d47a1)',
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 700,
            backdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 6,
            color: 'white',
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                mb: 4,
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 40,
                  bgcolor: '#fff',
                  color: '#1976d2',
                  boxShadow: 5,
                }}
              >
                {user.name?.[0]}
              </Avatar>
              <Typography variant="h4" mt={2}>
                {user.name}
              </Typography>
              <Typography variant="body1" color="gray">
                {user.role}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={user.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={!edit}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user.email}
                  disabled
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={user.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  disabled={!edit}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role"
                  value={user.role}
                  disabled
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              {!edit ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setEdit(true)}
                  sx={{ px: 5, borderRadius: 2 }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSave}
                  sx={{ px: 5, borderRadius: 2 }}
                >
                  Save Changes
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        <Snackbar
          open={!!snackbar}
          autoHideDuration={4000}
          onClose={() => setSnackbar('')}
          message={snackbar}
        />
      </Box>
    </Fade>
  );
}
