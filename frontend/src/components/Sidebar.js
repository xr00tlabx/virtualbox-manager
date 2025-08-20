import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen, toggleSidebar }) {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'sidebar-link active' : 'sidebar-link';
    };

    const menuItems = [
      { path: '/', icon: '🏠', label: 'Dashboard', badge: null },
      { path: '/vms', icon: '💻', label: 'Virtual Machines', badge: '5' },
      { path: '/snapshots', icon: '📸', label: 'Snapshots', badge: '12' },
      { path: '/scripts', icon: '📝', label: 'Scripts', badge: '3' },
      { path: '/settings', icon: '⚙️', label: 'Settings', badge: null },
  ];

    const quickActions = [
        { action: 'new-vm', icon: '➕', label: 'New VM' },
        { action: 'import', icon: '📥', label: 'Import VM' },
        { action: 'backup', icon: '💾', label: 'Backup All' },
    ];

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">⚡</span>
                        <span className="logo-text">VirtualBox</span>
                    </div>
                    <button className="sidebar-close" onClick={toggleSidebar}>
                        ✕
                    </button>
                </div>

              <nav className="sidebar-nav">
                  <div className="nav-section">
                      <h3 className="nav-section-title">Navigation</h3>
                      {menuItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={isActive(item.path)}
                    onClick={() => window.innerWidth <= 768 && toggleSidebar()}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                </Link>
            ))}
                  </div>

                  <div className="nav-section">
                      <h3 className="nav-section-title">Quick Actions</h3>
                      {quickActions.map((action) => (
                          <button
                              key={action.action}
                              className="sidebar-action"
                              onClick={() => {
                                  console.log(`Action: ${action.action}`);
                                  window.innerWidth <= 768 && toggleSidebar();
                              }}
                          >
                    <span className="nav-icon">{action.icon}</span>
                    <span className="nav-label">{action.label}</span>
                </button>
            ))}
                  </div>
              </nav>

              <div className="sidebar-footer">
                  <div className="user-info">
                      <div className="user-avatar">👤</div>
                      <div className="user-details">
                          <div className="user-name">Administrator</div>
                          <div className="user-status">Online</div>
                      </div>
                  </div>
              </div>
          </aside>
      </>
  );
}

export default Sidebar;
