import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { UserResponse } from '../types/user';

interface TopBarProps {
  isOpen: boolean;
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ isOpen, onToggleSidebar }) => {
  const { user } = useAuth() as { user: UserResponse | null };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          background: 'rgba(63, 203, 243, 0.15)',
          color: '#3fcbf3',
          border: '1px solid rgba(63, 203, 243, 0.3)'
        };
      case 'curator':
        return {
          background: 'rgba(75, 222, 151, 0.15)',
          color: '#4bde97',
          border: '1px solid rgba(75, 222, 151, 0.3)'
        };
      case 'researcher':
        return {
          background: 'rgba(255, 170, 85, 0.15)',
          color: '#ffaa55',
          border: '1px solid rgba(255, 170, 85, 0.3)'
        };
      default: // user/worker
        return {
          background: 'rgba(190, 190, 255, 0.15)',
          color: '#bebeff',
          border: '1px solid rgba(190, 190, 255, 0.3)'
        };
    }
  };

  const roleStyle = getRoleColor(user?.role || 'user');

  return (
    <div className="topbar">
      <div className="topbar-content">
        <button 
          className="burger-menu"
          onClick={onToggleSidebar}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <div className="burger-line"></div>
          <div className="burger-line"></div>
          <div className="burger-line"></div>
        </button>
        <img 
          src="/logoarchivista2.png" 
          alt="Archivista Logo" 
          className="topbar-logo"
          loading="eager"
        />
        <div className="topbar-text">
          <div className="topbar-title">Archaeology Museum</div>
          <div className="topbar-subtitle">Collection Management</div>
        </div>
        {user && (
          <div className="user-info">
            <div className="user-avatar">
              <FaUserCircle size={24} />
            </div>
            <div className="user-details">
              <div className="user-name">
                {user.firstName} {user.lastName}
              </div>
              <div 
                className="user-role"
                style={roleStyle}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar; 