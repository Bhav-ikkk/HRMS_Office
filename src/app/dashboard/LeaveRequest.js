// pages/dashboard/leave-request.js
'use client';

import { Typography, Box, Button, Container } from '@mui/material';

export default function LeaveRequestPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Leave Request
      </Typography>
      
      {/* Form Section */}
      <Box component="section" sx={{ 
        p: 3, 
        border: '1px solid #e0e0e0', 
        borderRadius: 1,
        mt: 2
      }}>
        <Typography variant="h6" gutterBottom>
          New Leave Application
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
        >
          Submit Leave Request
        </Button>
      </Box>
    </Container>
  );
}