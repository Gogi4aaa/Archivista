import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Example components for different routes
const Home = () => (
  <div>
    <h1>Welcome to Archivista</h1>
    <p>Your personal document management system</p>
  </div>
);

const Documents = () => (
  <div>
    <h1>Documents</h1>
    <p>Your documents will appear here</p>
  </div>
);

const Settings = () => (
  <div>
    <h1>Settings</h1>
    <p>Application settings and preferences</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/documents">Documents</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
