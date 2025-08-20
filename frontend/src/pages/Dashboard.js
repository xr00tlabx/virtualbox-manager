import React from 'react';
import { useQuery } from 'react-query';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Computer as ComputerIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  CameraAlt as SnapshotIcon,
  Code as ScriptIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { vmService, snapshotService, scriptService } from '../services';

const Dashboard = () => {
  const { data: vmsData, isLoading: vmsLoading, refetch: refetchVMs } = useQuery(
    'dashboard-vms',
    () => vmService.getVMs(),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const { data: snapshotsData, isLoading: snapshotsLoading } = useQuery(
    'dashboard-snapshots',
    () => snapshotService.getSnapshots({ limit: 5 })
  );

  const { data: scriptsData, isLoading: scriptsLoading } = useQuery(
    'dashboard-scripts',
    () => scriptService.getScripts({ limit: 5 })
  );

  const vms = vmsData?.data?.vms || [];
  const snapshots = snapshotsData?.data?.snapshots || [];
  const scripts = scriptsData?.data?.scripts || [];

  const vmStats = {
    total: vms.length,
    running: vms.filter(vm => vm.status === 'running').length,
    stopped: vms.filter(vm => vm.status === 'stopped').length,
    paused: vms.filter(vm => vm.status === 'paused').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'success';
      case 'stopped':
        return 'error';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <PlayIcon fontSize="small" />;
      case 'stopped':
        return <StopIcon fontSize="small" />;
      case 'paused':
        return <PauseIcon fontSize="small" />;
      default:
        return <ComputerIcon fontSize="small" />;
    }
  };

  if (vmsLoading || snapshotsLoading || scriptsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <IconButton onClick={refetchVMs} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total VMs
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {vmStats.total}
                  </Typography>
                </Box>
                <ComputerIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Running VMs
                  </Typography>
                  <Typography variant="h5" component="h2" color="success.main">
                    {vmStats.running}
                  </Typography>
                </Box>
                <PlayIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Snapshots
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {snapshots.length}
                  </Typography>
                </Box>
                <SnapshotIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Scripts
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {scripts.length}
                  </Typography>
                </Box>
                <ScriptIcon color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Virtual Machines
              </Typography>
              {vms.length === 0 ? (
                <Typography color="textSecondary">
                  No virtual machines found
                </Typography>
              ) : (
                <Box>
                  {vms.slice(0, 5).map((vm) => (
                    <Box
                      key={vm._id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                      borderBottom="1px solid #eee"
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        {getStatusIcon(vm.status)}
                        <Typography variant="body1">{vm.name}</Typography>
                      </Box>
                      <Chip
                        label={vm.status}
                        color={getStatusColor(vm.status)}
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Snapshots
              </Typography>
              {snapshots.length === 0 ? (
                <Typography color="textSecondary">
                  No snapshots found
                </Typography>
              ) : (
                <Box>
                  {snapshots.map((snapshot) => (
                    <Box
                      key={snapshot._id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                      borderBottom="1px solid #eee"
                    >
                      <Box>
                        <Typography variant="body1">{snapshot.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {snapshot.vmId?.name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(snapshot.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
