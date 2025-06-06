import React from 'react';
import { NavLink } from 'react-router-dom';

const sidebarLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/documents', label: 'Documents', icon: '📄' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar = () => (
  <aside className="sidebar">
    <nav className="nav">
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
    </nav>
  </aside>
);

export default Sidebar; 