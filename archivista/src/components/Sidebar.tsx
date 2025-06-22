import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const sidebarLinks = [
  { to: '/', label: 'Statistics', icon: '📊' },
  { to: '/documents', label: 'Documents', icon: '🏺' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    toast.success("Successfully logged out!")
    logout();
  };

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
        <button 
          onClick={handleLogout}
          className="nav-link logout-button"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar; 