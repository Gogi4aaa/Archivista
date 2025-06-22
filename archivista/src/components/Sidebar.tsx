import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Define navigation items for different roles
const adminLinks = [
  { to: '/', label: 'Statistics', icon: '📊' },
  { to: '/artifacts', label: 'Artifacts', icon: '🏺' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

const userLinks = [
  { to: '/artifacts', label: 'Artifacts', icon: '🏺' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    toast.success("Successfully logged out!")
    logout();
  };

  // Select navigation items based on user role
  const sidebarLinks = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      <nav className="nav">
        <div className="logo-container">
          <img 
            src="/logoarchivista2.png" 
            alt="Archivista Logo" 
            className="sidebar-logo"
            loading="eager"
          />
        </div>
        <div className="nav-links">
        {sidebarLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' active' : '')
            }
            end={link.to === '/'}
          >
            <span style={{ marginRight: 12 }}>{link.icon}</span> {link.label}
          </NavLink>
        ))}
        </div>
        <div className="user-info">
          <span className="user-name">{user?.username}</span>
          <span className="user-role">{user?.role}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="nav-link logout-button"
        >
          <span style={{ marginRight: 12 }}>🚪</span> Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar; 