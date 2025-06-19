import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
  const { user, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one field is filled
    if (!formData.username && !formData.email) {
      toast.error('Please fill out at least one field to update');
      return;
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Only include fields that have been filled out
      const updates: { userId: string; username?: string; email?: string } = {
        userId: user!.id // Safe to use ! here because we check authentication above
      };
      if (formData.username) updates.username = formData.username;
      if (formData.email) updates.email = formData.email;

      await userService.updateProfile(updates);
      
      // Update the user state with new values
      updateUser({
        ...user!,
        ...(formData.username && { username: formData.username }),
        ...(formData.email && { email: formData.email })
      });

      toast.success('Profile updated successfully');
      setFormData({ username: '', email: '' }); // Clear form
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="content">
        <div className="settings-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render the form if not authenticated
  if (!isAuthenticated || !user) {
    return null; // useEffect will handle redirect
  }

  return (
    <div className="content">
      <div className="settings-container">
        <section className="settings-section">
          <h2>Profile Settings</h2>

          <div className="current-profile">
            <div className="current-info">
              <strong>Current Username:</strong> {user.username}
            </div>
            <div className="current-info">
              <strong>Current Email:</strong> {user.email}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="settings-row">
              <div className="settings-label">
                <h3>New Username</h3>
                <p>Choose a new username for your account</p>
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter new username"
                className="settings-input"
                disabled={isLoading}
              />
            </div>

            <div className="settings-row">
              <div className="settings-label">
                <h3>New Email</h3>
                <p>Update your email address</p>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter new email"
                className="settings-input"
                disabled={isLoading}
              />
            </div>

            <div className="settings-actions">
              <button 
                type="submit" 
                className="button"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings; 