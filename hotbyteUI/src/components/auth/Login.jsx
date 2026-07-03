import React, { useState } from 'react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    // TODO: Add API call here
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your account to continue</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <InputField
            label="Username or Email"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username or email"
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          
          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>

          <Button type="submit" variant="primary" className="auth-submit-btn">
            Login
          </Button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <a href="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
