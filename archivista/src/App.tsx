import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Page Components
import Home from './components/pages/Home';
import Documents from './components/pages/Documents';
import Settings from './components/pages/Settings';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <TopBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
