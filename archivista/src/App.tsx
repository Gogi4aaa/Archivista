import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/Login.css';

// Layout Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Page Components
import Home from './components/pages/Home';
import Documents from './components/pages/Documents';
import Settings from './components/pages/Settings';
import Login from './components/pages/Login';
import UserManagement from './components/pages/UserManagement';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from 'react-hot-toast';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {isAuthenticated && <Sidebar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {isAuthenticated && <TopBar />}
        <Routes>
          {/* Default route redirects to login if not authenticated, statistics if authenticated */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          {/* Login route - redirects to statistics if already authenticated */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
          />
          {/* Protected routes */}
          <Route path="/documents" element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          {/* Catch all route - redirects to login or statistics */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <AppContent />
          <Toaster position="top-right" reverseOrder={false} />
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
