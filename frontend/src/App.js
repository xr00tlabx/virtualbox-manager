import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VirtualMachines from './pages/VirtualMachines';
import VMDetails from './pages/VMDetails';
import Snapshots from './pages/Snapshots';
import Scripts from './pages/Scripts';
import ScriptEditor from './pages/ScriptEditor';
import Settings from './pages/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onMenuClick={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8, // Account for navbar height
          pl: { sm: '240px' }, // Account for sidebar width on larger screens
          transition: 'padding-left 0.3s ease',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vms" element={<VirtualMachines />} />
            <Route path="/vms/:id" element={<VMDetails />} />
            <Route path="/snapshots" element={<Snapshots />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/scripts/new" element={<ScriptEditor />} />
            <Route path="/scripts/:id/edit" element={<ScriptEditor />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
