"use client"
import * as React from 'react';
import PropTypes, { func } from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import Time from '@mui/icons-material/Timelapse';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useRouter, usePathname } from 'next/navigation';
import Logout from '@mui/icons-material/Logout';
import Request from '@mui/icons-material/RequestQuote';
import Status from '@mui/icons-material/Approval';
import Employee from '@mui/icons-material/VerifiedUser';
import Departmant from '@mui/icons-material/WorkspacesFilled'
import { useEffect } from 'react';





const NAVIGATION = [
  {
    segment: 'employee',
    title: 'Employee',
    icon: <Employee />,
  },
  {
    segment: 'department',
    title: 'Department',
    icon: <Departmant />,
  },
  {
    segment: 'time_status',
    title: 'Working Status',
    icon: <Time />,
  },
  {
    segment: 'leave_request',
    title: 'Leave Request',
    icon: <Request />,
  },
  {
    segment: 'approve',
    title: 'Leave Status',
    icon: <Status />,
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <Logout />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname, router }) {
    useEffect(() => {
        if (pathname === '/employee') {
          alert("Employee section opened!");
          // or do anything: show modal, fetch data, toast, etc.
        }
        
        if (pathname === '/logout') {
            router.push("/login");
        }
          
      }, [pathname , router]);

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
    const { window } = props;
  
    const pathname = usePathname();
    const router = useRouter();
    const demoWindow = window !== undefined ? window() : undefined;
  
    return (
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: <img src="https://cdn-icons-png.flaticon.com/128/10218/10218090.png" alt="DASHBOARD logo" />,
          title: 'DASHBOARD',
          homeUrl: '/toolpad/core/introduction',
        }}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout>
          <DemoPageContent pathname={pathname} router={router} />
        </DashboardLayout>
      </AppProvider>
    );
  }
  

DashboardLayoutBranding.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
