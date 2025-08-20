import api from './api';

export const vmService = {
  // Get all VMs
  getVMs: (params = {}) => {
    return api.get('/vms', { params });
  },

  // Get VM by ID
  getVM: (id) => {
    return api.get(`/vms/${id}`);
  },

  // Create new VM
  createVM: (data) => {
    return api.post('/vms', data);
  },

  // Update VM
  updateVM: (id, data) => {
    return api.put(`/vms/${id}`, data);
  },

  // Delete VM
  deleteVM: (id, deleteFiles = false) => {
    return api.delete(`/vms/${id}`, { data: { deleteFiles } });
  },

  // VM Control Operations
  startVM: (id) => {
    return api.post(`/vms/${id}/start`);
  },

  stopVM: (id, force = false) => {
    return api.post(`/vms/${id}/stop`, { force });
  },

  restartVM: (id) => {
    return api.post(`/vms/${id}/restart`);
  },

  pauseVM: (id) => {
    return api.post(`/vms/${id}/pause`);
  },

  resumeVM: (id) => {
    return api.post(`/vms/${id}/resume`);
  },

  // VM Utilities
  getVMScreenshot: (id) => {
    return api.get(`/vms/${id}/screenshot`, { responseType: 'blob' });
  },

  executeCommand: (id, data) => {
    return api.post(`/vms/${id}/execute`, data);
  },
};

export const snapshotService = {
  // Get all snapshots
  getSnapshots: (params = {}) => {
    return api.get('/snapshots', { params });
  },

  // Get snapshots for a VM
  getVMSnapshots: (vmId, params = {}) => {
    return api.get(`/snapshots/vm/${vmId}`, { params });
  },

  // Get snapshot by ID
  getSnapshot: (id) => {
    return api.get(`/snapshots/${id}`);
  },

  // Create snapshot
  createSnapshot: (vmId, data) => {
    return api.post(`/snapshots/vm/${vmId}`, data);
  },

  // Update snapshot
  updateSnapshot: (id, data) => {
    return api.put(`/snapshots/${id}`, data);
  },

  // Delete snapshot
  deleteSnapshot: (id) => {
    return api.delete(`/snapshots/${id}`);
  },

  // Restore snapshot
  restoreSnapshot: (id) => {
    return api.post(`/snapshots/${id}/restore`);
  },

  // Sync snapshots
  syncSnapshots: (vmId) => {
    return api.post(`/snapshots/vm/${vmId}/sync`);
  },
};

export const scriptService = {
  // Get all scripts
  getScripts: (params = {}) => {
    return api.get('/scripts', { params });
  },

  // Get script by ID
  getScript: (id) => {
    return api.get(`/scripts/${id}`);
  },

  // Create script
  createScript: (data) => {
    return api.post('/scripts', data);
  },

  // Update script
  updateScript: (id, data) => {
    return api.put(`/scripts/${id}`, data);
  },

  // Delete script
  deleteScript: (id) => {
    return api.delete(`/scripts/${id}`);
  },

  // Execute script
  executeScript: (id, data = {}) => {
    return api.post(`/scripts/${id}/execute`, data);
  },

  // Get execution history
  getExecutionHistory: (id, params = {}) => {
    return api.get(`/scripts/${id}/history`, { params });
  },

  // Get script statistics
  getScriptStats: (id) => {
    return api.get(`/scripts/${id}/stats`);
  },
};

export const authService = {
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  getProfile: () => {
    return api.get('/auth/me');
  },
};
