'use client';
import * as React from 'react';
import {
  Stack,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { DataGrid } from '@mui/x-data-grid';

export default function TimeStatusPage() {
  const [data, setData] = React.useState([]);
  const [layout, setLayout] = React.useState('vertical');
  const [loading, setLoading] = React.useState(true);
  const [employeeFilter, setEmployeeFilter] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/traces');
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredData = data.filter((log) => {
    const loginDate = new Date(log.loginAt).toLocaleDateString();
    return (
      (!employeeFilter || log.user.name.toLowerCase().includes(employeeFilter.toLowerCase())) &&
      (!dateFilter || loginDate === dateFilter)
    );
  });

  const formatChartData = () => {
    const grouped = {};

    filteredData.forEach(({ user, loginAt, logoutAt }) => {
      const date = new Date(loginAt).toLocaleDateString();
      const name = user.name;
      const key = `${name} - ${date}`;

      const hours = logoutAt
        ? (new Date(logoutAt) - new Date(loginAt)) / 1000 / 60 / 60
        : 0;

      if (!grouped[key]) {
        grouped[key] = { order: key, sessions: 0, totalHours: 0 };
      }

      grouped[key].sessions += 1;
      grouped[key].totalHours += hours;
    });

    return Object.values(grouped);
  };

  const chartData = formatChartData();

  const chartSettingsH = {
    dataset: chartData,
    height: 350,
    yAxis: [{ scaleType: 'band', dataKey: 'order' }],
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: 'translateX(-10px)',
      },
    },
    slotProps: {
      legend: {
        direction: 'row',
        position: { vertical: 'bottom', horizontal: 'middle' },
        padding: -5,
      },
    },
  };

  const chartSettingsV = {
    ...chartSettingsH,
    xAxis: [{ scaleType: 'band', dataKey: 'order' }],
    yAxis: undefined,
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'loginAt', headerName: 'Login At', flex: 1.5 },
    { field: 'logoutAt', headerName: 'Logout At', flex: 1.5 },
    { field: 'duration', headerName: 'Duration (hrs)', flex: 1 },
  ];

  const rows = filteredData.map((log, index) => {
    const duration = log.logoutAt
      ? ((new Date(log.logoutAt) - new Date(log.loginAt)) / 1000 / 60 / 60).toFixed(2)
      : 'Active';

    return {
      id: index,
      name: log.user.name,
      email: log.user.email,
      loginAt: new Date(log.loginAt).toLocaleString(),
      logoutAt: log.logoutAt ? new Date(log.logoutAt).toLocaleString() : 'Active',
      duration,
    };
  });

  return (
    <Stack spacing={4} sx={{ padding: 4 }}>
      <Typography variant="h4">Employee Login/Logout Dashboard</Typography>

      {/* Filters */}
      <Stack direction="row" spacing={2}>
        <TextField
          label="Search Employee"
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Filter by Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <TextField
          select
          label="Layout"
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="horizontal">Horizontal</MenuItem>
          <MenuItem value="vertical">Vertical</MenuItem>
        </TextField>
      </Stack>

      {/* Graph */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Login / Logout Summary Graph
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <BarChart
              series={[
                {
                  dataKey: 'sessions',
                  label: 'Sessions',
                  stack: 'stack',
                  layout,
                },
                {
                  dataKey: 'totalHours',
                  label: 'Total Hours',
                  stack: 'stack',
                  layout,
                },
              ]}
              {...(layout === 'vertical' ? chartSettingsV : chartSettingsH)}
              borderRadius={10}
            />
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Logs
          </Typography>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </div>
        </CardContent>
      </Card>
    </Stack>
  );
}
