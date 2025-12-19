import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../state/store';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useStore();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/claims', label: 'Claims', icon: '📋' },
    { path: '/upload', label: 'Upload', icon: '📤' },
    { path: '/graph', label: 'Graph', icon: '🔗' },
    { path: '/investigation', label: 'Investigation', icon: '🔍' },
    { path: '/audit', label: 'Audit Log', icon: '📜' },
  ];

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1>🏥 Fraud Detection Platform</h1>
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <nav>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="user-profile-section">
            <div className="settings-option">
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </div>
            <div className="user-profile">
              <div className="user-avatar">👤</div>
              <div className="user-details">
                <div className="user-email">{currentUser}</div>
                <button onClick={logout} className="btn-logout-sidebar">Logout</button>
              </div>
            </div>
          </div>
        </aside>

        <main className="content">
          {children}
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Medical Insurance Fraud Detection Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
