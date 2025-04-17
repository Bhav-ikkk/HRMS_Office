'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
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
import Departmant from '@mui/icons-material/WorkspacesFilled';
import { useEffect, useMemo } from 'react';

import { useSession } from 'next-auth/react';
import { defineAbilitiesFor } from '../lib/ability'; // Make sure this exists

// 🧠 Your role-based CASL hook
const useAbility = () => {
  const { data: session, status } = useSession();
  const role = status === 'authenticated' ? session?.user?.role : 'guest';
  return useMemo(() => defineAbilitiesFor(role), [role]);
};

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
      alert('Employee section opened!');
    }

    if (pathname === '/logout') {
      router.push('/login');
    }
  }, [pathname, router]);

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
      <Typography>Dashboard Path: {pathname}</Typography>
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

  const { data: session, status } = useSession();
  const ability = useAbility();

  // 🛡️ Role Check: Render only when session is ready
  if (status === 'loading') {
    return <Typography>Loading dashboard...</Typography>;
  }

  // 🔐 Role-based Navigation using CASL
  const NAVIGATION = [
    ability.can('manage', 'Users') && {
      segment: 'employee',
      title: 'Employee',
      icon: <Employee />,
    },
    ability.can('manage', 'Department') && {
      segment: 'department',
      title: 'Department',
      icon: <Departmant />,
    },
    ability.can('view', 'OwnTime') && {
      segment: 'time_status',
      title: 'Working Status',
      icon: <Time />,
    },
    ability.can('request', 'Leave') && {
      segment: 'leave_request',
      title: 'Leave Request',
      icon: <Request />,
    },
    ability.can('view', 'LeaveStatus') && {
      segment: 'approve',
      title: 'Leave Status',
      icon: <Status />,
    },
    {
      segment: 'logout',
      title: 'Logout',
      icon: <Logout />,
    },
  ].filter(Boolean); // 👈 Remove falsy items

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: (
          <img
            src="https://cdn-icons-png.flaticon.com/128/10218/10218090.png"
            alt="DASHBOARD logo"
          />
        ),
        title: 'DASHBOARD',
        homeUrl: '/toolpad/core/introduction',
      }}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <Typography variant="h5" sx={{ mt: 2, textAlign: 'center' }}>
          Welcome, {session?.user?.name} ({session?.user?.role})
        </Typography>
        <DemoPageContent pathname={pathname} router={router} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBranding.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
