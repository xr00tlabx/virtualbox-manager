import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Scripts from './pages/Scripts';
import Settings from './pages/Settings';
import Snapshots from './pages/Snapshots';
import VirtualMachines from './pages/VirtualMachines';
import VMDetails from './pages/VMDetails';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
  };

  return (
      <div className="app">
          <Navbar />
          <div className="app-container">
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <main className="main-content">
                  <div className="content-header">
                      <button className="sidebar-toggle" onClick={toggleSidebar}>
                          <span className="hamburger"></span>
                          <span className="hamburger"></span>
                          <span className="hamburger"></span>
                      </button>
                  </div>
                  <div className="content-body">
                      <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/vms" element={<VirtualMachines />} />
                          <Route path="/vms/:id" element={<VMDetails />} />
                          <Route path="/scripts" element={<Scripts />} />
                          <Route path="/snapshots" element={<Snapshots />} />
                          <Route path="/settings" element={<Settings />} />
                      </Routes>
                  </div>
              </main>
          </div>
      </div>
  );
}

export default App;
