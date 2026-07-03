import React, { useState } from 'react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import './Register.css';

const Register = () => {
  const [role, setRole] = useState('USER'); // 'USER' or 'RESTAURANT'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    gender: 'Other',
    password: '',
    confirmPassword: '',
    restaurantName: '', // For restaurant only
    location: '' // For restaurant only
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    console.log('Register submitted for role:', role, formData);
    // TODO: Add API call here
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h2 className="auth-title">Create an Account</h2>
        <p className="auth-subtitle">Join HotByte and experience the best food delivery</p>

        <div className="role-selector">
          <button 
            className={`role-btn ${role === 'USER' ? 'active' : ''}`}
            onClick={() => setRole('USER')}
          >
            Customer
          </button>
          <button 
            className={`role-btn ${role === 'RESTAURANT' ? 'active' : ''}`}
            onClick={() => setRole('RESTAURANT')}
          >
            Restaurant
          </button>
        </div>
        
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form register-form">
          <div className="form-grid">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
            <InputField
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="1234567890"
              required
            />
            {role === 'USER' && (
              <InputField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Male/Female/Other"
              />
            )}
          </div>

          {role === 'RESTAURANT' && (
            <div className="form-grid">
              <InputField
                label="Restaurant Name"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                placeholder="Hot Pot Specials"
                required
              />
              <InputField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="123 Food Street, City"
                required
              />
            </div>
          )}

          {role === 'USER' && (
            <InputField
              label="Delivery Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, Apt 4B, City, Country"
              required
            />
          )}

          <div className="form-grid">
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <Button type="submit" variant="primary" className="auth-submit-btn">
            Create Account
          </Button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
