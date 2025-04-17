// components/DashboardLayoutWrapper.js
'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { createTheme } from '@mui/material/styles';
import { defineAbilitiesFor } from '@/lib/ability';
import Logout from '@mui/icons-material/Logout';
import Request from '@mui/icons-material/RequestQuote';
import Status from '@mui/icons-material/Approval';
import Employee from '@mui/icons-material/VerifiedUser';
import Departmant from '@mui/icons-material/WorkspacesFilled';
import Time from '@mui/icons-material/Timelapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LeaveRequestPage from '@/app/dashboard/LeaveRequest';

const useAbility = () => {
  const { data: session, status } = useSession();
  const role = status === 'authenticated' ? session?.user?.role : 'guest';
  return useMemo(() => defineAbilitiesFor(role), [role]);
};




export default function DashboardLayoutWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const ability = useAbility();
  
  // Your existing theme configuration
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

// Move NAVIGATION inside the component after ability is defined
const NAVIGATION = useMemo(() => [
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
    segment: 'LeaveRequest',
    title: 'Leave Request',
    icon: <Request />,
    href: <LeaveRequestPage />,  // Add this
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
].filter(Boolean), [ability]); // Add ability as dependency


  useEffect(() => {
    if (pathname === '/logout') {
      router.push('/login');
    }
  }, [pathname, router]);

  if (status === 'loading') {
    return <Typography>Loading dashboard...</Typography>;
  }

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
    >
      <DashboardLayout>
        <Typography variant="h5" sx={{ mt: 2, textAlign: 'center' }}>
          Welcome, {session?.user?.name} ({session?.user?.role})
        </Typography>
        {children}
      </DashboardLayout>
    </AppProvider>
  );
}