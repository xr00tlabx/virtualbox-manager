import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  Restart as RestartIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Computer as ComputerIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { vmService } from '../services';
import toast from 'react-hot-toast';

const VirtualMachines = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedVM, setSelectedVM] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteFiles, setDeleteFiles] = React.useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery(
    ['vms', searchTerm],
    () => vmService.getVMs({ search: searchTerm }),
    {
      refetchInterval: 30000,
    }
  );

  const startVMMutation = useMutation(vmService.startVM, {
    onSuccess: () => {
      toast.success('VM started successfully');
      queryClient.invalidateQueries('vms');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to start VM');
    },
  });

  const stopVMMutation = useMutation(
    ({ id, force }) => vmService.stopVM(id, force),
    {
      onSuccess: () => {
        toast.success('VM stopped successfully');
        queryClient.invalidateQueries('vms');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to stop VM');
      },
    }
  );

  const deleteVMMutation = useMutation(
    ({ id, deleteFiles }) => vmService.deleteVM(id, deleteFiles),
    {
      onSuccess: () => {
        toast.success('VM deleted successfully');
        queryClient.invalidateQueries('vms');
        setDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete VM');
      },
    }
  );

  const vms = data?.data?.vms || [];

  const handleMenuClick = (event, vm) => {
    setAnchorEl(event.currentTarget);
    setSelectedVM(vm);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVM(null);
  };

  const handleVMAction = async (action, vm) => {
    handleMenuClose();
    
    switch (action) {
      case 'start':
        startVMMutation.mutate(vm._id);
        break;
      case 'stop':
        stopVMMutation.mutate({ id: vm._id, force: false });
        break;
      case 'stop-force':
        stopVMMutation.mutate({ id: vm._id, force: true });
        break;
      case 'restart':
        // Implement restart
        break;
      case 'pause':
        // Implement pause
        break;
      case 'delete':
        setSelectedVM(vm);
        setDeleteDialogOpen(true);
        break;
      case 'details':
        navigate(`/vms/${vm._id}`);
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedVM) {
      deleteVMMutation.mutate({
        id: selectedVM._id,
        deleteFiles,
      });
    }
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
        return <PlayIcon color="success" />;
      case 'stopped':
        return <StopIcon color="error" />;
      case 'paused':
        return <PauseIcon color="warning" />;
      default:
        return <ComputerIcon />;
    }
  };

  const formatMemory = (mb) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
  };

  const formatStorage = (gb) => {
    if (gb >= 1024) {
      return `${(gb / 1024).toFixed(1)} TB`;
    }
    return `${gb} GB`;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Virtual Machines
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/vms/new')}
        >
          Create VM
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search virtual machines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {vms.map((vm) => (
          <Grid item xs={12} sm={6} md={4} key={vm._id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(vm.status)}
                    <Typography variant="h6" component="h2">
                      {vm.name}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, vm)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box mb={2}>
                  <Chip
                    label={vm.status.toUpperCase()}
                    color={getStatusColor(vm.status)}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {vm.description || 'No description'}
                  </Typography>
                </Box>

                <Box display="flex" flex="column" gap={1} mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ComputerIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {vm.osType}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <MemoryIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatMemory(vm.memory)} RAM, {vm.cpus} CPU(s)
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <StorageIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatStorage(vm.diskSize)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" gap={1} mt={2}>
                  {vm.status === 'stopped' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<PlayIcon />}
                      onClick={() => handleVMAction('start', vm)}
                      disabled={startVMMutation.isLoading}
                    >
                      Start
                    </Button>
                  )}
                  {vm.status === 'running' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      startIcon={<StopIcon />}
                      onClick={() => handleVMAction('stop', vm)}
                      disabled={stopVMMutation.isLoading}
                    >
                      Stop
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {vms.length === 0 && (
        <Box textAlign="center" py={4}>
          <ComputerIcon sx={{ fontSize: 80, color: 'action.disabled', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No virtual machines found
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Create your first virtual machine to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/vms/new')}
          >
            Create VM
          </Button>
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleVMAction('details', selectedVM)}>
          View Details
        </MenuItem>
        {selectedVM?.status === 'stopped' && (
          <MenuItem onClick={() => handleVMAction('start', selectedVM)}>
            Start VM
          </MenuItem>
        )}
        {selectedVM?.status === 'running' && (
          <>
            <MenuItem onClick={() => handleVMAction('stop', selectedVM)}>
              Stop VM
            </MenuItem>
            <MenuItem onClick={() => handleVMAction('stop-force', selectedVM)}>
              Force Stop
            </MenuItem>
            <MenuItem onClick={() => handleVMAction('restart', selectedVM)}>
              Restart VM
            </MenuItem>
            <MenuItem onClick={() => handleVMAction('pause', selectedVM)}>
              Pause VM
            </MenuItem>
          </>
        )}
        <MenuItem onClick={() => handleVMAction('delete', selectedVM)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete VM
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to delete the virtual machine "{selectedVM?.name}"?
          </Typography>
          <Box mt={2}>
            <label>
              <input
                type="checkbox"
                checked={deleteFiles}
                onChange={(e) => setDeleteFiles(e.target.checked)}
              />
              <Typography variant="body2" component="span" ml={1}>
                Also delete VM files from disk
              </Typography>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteVMMutation.isLoading}
          >
            {deleteVMMutation.isLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => navigate('/vms/new')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default VirtualMachines;
