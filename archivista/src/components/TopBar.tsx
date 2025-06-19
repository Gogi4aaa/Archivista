import React from 'react';

const TopBar = () => (
  <div className="topbar">
    <div className="topbar-content">
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
    </div>
  </div>
);

export default TopBar; 