'use client';

import { useSession, signOut } from 'next-auth/react';
import { useMemo, useState, useEffect } from 'react';
import { defineAbilitiesFor } from '../lib/ability';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
  CssBaseline,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  InputLabel,
  FormControl,
  Select,
  MenuItem as MuiMenuItem,
  Slide,
  Paper,
} from '@mui/material';

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  VerifiedUser as EmployeeIcon,
  WorkspacesFilled as DeptIcon,
  Timelapse as TimeIcon,
  RequestQuote as RequestIcon,
  Approval as StatusIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Palette as PaletteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mode, setMode] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#1976d2');

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    const storedTheme = localStorage.getItem('themeMode') || (prefersDarkMode ? 'dark' : 'light');
    const storedColor = localStorage.getItem('themePrimaryColor') || '#1976d2';
    setMode(storedTheme);
    setPrimaryColor(storedColor);
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('themePrimaryColor', primaryColor);
  }, [mode, primaryColor]);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: { main: primaryColor },
        secondary: { main: '#f50057' },
        background: {
          default: mode === 'light' ? '#f0f2f5' : '#121212',
        },
      },
      shape: { borderRadius: 16 },
      typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontWeightRegular: 400,
        fontWeightMedium: 600,
        fontWeightBold: 700,
      },
      components: {
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? 'rgba(18,18,18,0.85)' : 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? 'rgba(18,18,18,0.9)' : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            },
          },
        },
      },
    }), [mode, primaryColor]);

  const ability = useMemo(() => defineAbilitiesFor(session?.user?.role || 'guest'), [session]);
  const toggleDrawer = () => setOpen(!open);

  const navigation = [
    { href: '/dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
    ability.can('manage', 'Users') && { href: '/dashboard/employee', title: 'Employee', icon: <EmployeeIcon /> },
    ability.can('manage', 'Department') && { href: '/dashboard/department', title: 'Department', icon: <DeptIcon /> },
    ability.can('view', 'OwnTime') && { href: '/dashboard/time_status', title: 'Working Status', icon: <TimeIcon /> },
    ability.can('request', 'Leave') && { href: '/dashboard/leave_request', title: 'Leave Request', icon: <RequestIcon /> },
    ability.can('view', 'LeaveStatus') && { href: '/dashboard/approve', title: 'Leave Status', icon: <StatusIcon /> },
    { href: '/dashboard/profile', title: 'Profile', icon: <PersonIcon /> },
  ].filter(Boolean);

  if (status === 'loading') return <Typography sx={{ m: 5 }}>Loading...</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* AppBar */}
        <AppBar position="fixed" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={toggleDrawer}>
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
              <Typography variant="h6" noWrap sx={{ ml: 1, fontWeight: 600 }}>
                DASHBOARD
              </Typography>
            </Box>
            <Box>
              <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ bgcolor: primaryColor }}>{session?.user?.name?.[0]}</Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem disabled>{session.user.name} ({session.user.role})</MenuItem>
                <MenuItem onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                  {mode === 'light' ? <Brightness4Icon sx={{ mr: 1 }} /> : <Brightness7Icon sx={{ mr: 1 }} />}
                  Theme: {mode === 'light' ? 'Light' : 'Dark'}
                </MenuItem>
                <MenuItem disableRipple>
                  <PaletteIcon sx={{ mr: 1 }} />
                  <FormControl variant="standard" fullWidth>
                    <InputLabel>Primary Color</InputLabel>
                    <Select
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      label="Primary Color"
                    >
                      <MuiMenuItem value="#1976d2">Blue</MuiMenuItem>
                      <MuiMenuItem value="#2e7d32">Green</MuiMenuItem>
                      <MuiMenuItem value="#d32f2f">Red</MuiMenuItem>
                      <MuiMenuItem value="#6a1b9a">Purple</MuiMenuItem>
                      <MuiMenuItem value="#ff9800">Orange</MuiMenuItem>
                    </Select>
                  </FormControl>
                </MenuItem>
                <MenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? drawerWidth : 64,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : 64,
              mt: '64px',
              transition: 'width 0.3s ease',
              borderRight: 'none',
            },
          }}
        >
          <List>
            {navigation.map((item) => (
              <Tooltip key={item.title} title={open ? '' : item.title} placement="right" arrow>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    selected={pathname === item.href}
                    sx={{
                      pl: open ? 2 : 1.5,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s ease',
                      backgroundColor: pathname === item.href ? 'primary.main' : 'transparent',
                      color: pathname === item.href ? '#fff' : 'inherit',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: '#fff',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: open ? 40 : 32 }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && <ListItemText primary={item.title} />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Drawer>

        {/* Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
          <Slide in timeout={400} direction="up">
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Welcome, {session?.user?.name} ({session?.user?.role})
              </Typography>
              {children}
            </Paper>
          </Slide>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
