import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/Login.css';

// Layout Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Page Components
import Home from './components/pages/Home';
import Artifacts from './components/pages/Artifacts';
import Settings from './components/pages/Settings';
import Login from './components/pages/Login';
import UserManagement from './components/pages/UserManagement';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users based on their role
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    return user?.role === 'admin' ? '/' : '/artifacts';
  };

  return (
    <div className="App">
      {isAuthenticated && <Sidebar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {isAuthenticated && <TopBar />}
        <Routes>
          {/* Default route redirects based on role */}
          <Route path="/" element={
            <ProtectedRoute roles={['admin']}>
              <Home />
            </ProtectedRoute>
          } />

          {/* Login route - redirects to appropriate page if authenticated */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />} 
          />

          {/* Artifacts page - accessible by all authenticated users */}
          <Route path="/artifacts" element={
            <ProtectedRoute>
              <Artifacts />
            </ProtectedRoute>
          } />

          {/* Settings page - accessible by all authenticated users */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Admin-only routes */}
          <Route path="/users" element={
            <ProtectedRoute roles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />

          {/* Catch all route - redirects to appropriate page */}
          <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
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
