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
  { to: '/', label: 'Statistics', icon: '📊' },
  { to: '/artifacts', label: 'Artifacts', icon: '🏺' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    toast.success("Successfully logged out!")
    logout();
  };

  // Select navigation items based on user role
  const sidebarLinks = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
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
            <span style={{ marginRight: 12 }}>{link.icon}</span> 
            <span className="nav-label">{link.label}</span>
          </NavLink>
        ))}
        </div>
        <button 
          onClick={handleLogout}
          className="nav-link logout-button"
        >
          <span style={{ marginRight: 12 }}>🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar; 