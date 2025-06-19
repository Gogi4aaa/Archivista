import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ValidationError } from '../../types/Auth';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationError>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success("Successfully logged in!");
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      if (error.type === 'VALIDATION_ERROR') {
        setErrors(error.errors);
      } else if (error.type === 'USER_NOT_FOUND' || error.type === 'INVALID_CREDENTIALS') {
        setErrors({ general: 'Invalid email or password' });
      } else {
        setErrors({ general: 'An error occurred during login' });
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-logo">
          <img 
            src="/logoarchivista2.png" 
            alt="Archivista Logo" 
            className="login-logo-img"
            loading="eager"
          />
        </div>
        <h2>Login</h2>
        {errors.general && (
          <div className="error-message">
            <span className="error-icon">⚠</span>
            {errors.general}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="error-message">
                <span className="error-icon">⚠</span>
                {errors.email}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="error-message">
                <span className="error-icon">⚠</span>
                {errors.password}
              </div>
            )}
          </div>
          <button type="submit" disabled={isLoading} className={isLoading ? 'loading' : ''}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 