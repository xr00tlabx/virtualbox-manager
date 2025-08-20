import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
      <nav className="navbar">
          <div className="nav-container">
              <div className="nav-brand">
                  <Link to="/" className="brand-link">
                      <span className="brand-icon">⚡</span>
                      VirtualBox Manager
                  </Link>
              </div>

              <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                  <Link to="/" className={isActive('/')}>
                      <span className="nav-icon">🏠</span>
                      Dashboard
                  </Link>
                  <Link to="/vms" className={isActive('/vms')}>
                      <span className="nav-icon">💻</span>
                      Virtual Machines
                  </Link>
                  <Link to="/snapshots" className={isActive('/snapshots')}>
                      <span className="nav-icon">📸</span>
                      Snapshots
                  </Link>
                  <Link to="/scripts" className={isActive('/scripts')}>
                      <span className="nav-icon">📝</span>
                      Scripts
                  </Link>
                  <Link to="/settings" className={isActive('/settings')}>
                      <span className="nav-icon">⚙️</span>
                      Settings
                  </Link>
              </div>

              <div className="nav-actions">
                  <button className="btn btn-primary btn-sm">
                      <span className="nav-icon">➕</span>
                      New VM
                  </button>
                  <div className="user-menu">
                      <button className="user-avatar">
                          <span>👤</span>
                      </button>
                  </div>
              </div>

              <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <span></span>
                  <span></span>
                  <span></span>
              </div>
          </div>
      </nav>
  );
}

export default Navbar;
