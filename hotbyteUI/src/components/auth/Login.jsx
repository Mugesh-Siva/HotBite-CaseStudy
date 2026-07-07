// Login Page - uses Formik + Yup for form management and validation
// Calls real /api/auth/login endpoint and stores JWT in AuthContext

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

// Yup validation schema
const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');

  // Where to go after login (if user was redirected here from a protected route)
  const from = location.state?.from?.pathname || '/';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      try {
        const data = await login(values.email, values.password);
        toast.success(`Welcome back, ${data.fullName}!`);

        // Navigate based on role
        if (data.roleName === 'ADMIN') {
          navigate('/admin-dashboard');
        } else if (data.roleName === 'RESTAURANT_OWNER') {
          navigate('/restaurant-dashboard');
        } else {
          navigate(from, { replace: true });
        }
      } catch (err) {
        const message = err.response?.data?.error || 'Login failed. Please try again.';
        if (message.toLowerCase().includes('email') || message.toLowerCase().includes('password') || message.toLowerCase().includes('credential')) {
           formik.setFieldError('email', message);
           formik.setFieldError('password', message);
        } else {
           setServerError(message);
        }
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldClass = (fieldName) => {
    if (!formik.touched[fieldName]) return 'input-field';
    if (formik.errors[fieldName]) return 'input-field input-error';
    if (formik.values[fieldName]) return 'input-field input-success';
    return 'input-field';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="brand-hot">Hot</span><span className="brand-byte">Byte</span>
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your account to continue ordering</p>

        {serverError && (
          <div className="error-banner">
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="auth-form" noValidate>
          {/* Email Field */}
          <div className="field-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              className={getFieldClass('email')}
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <span className="error-text">{formik.errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className={getFieldClass('password')}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <span className="error-text">{formik.errors.password}</span>
            )}
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={formik.isSubmitting || (Object.keys(formik.touched).length > 0 && !formik.isValid)}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <a href="http://localhost:8080/oauth2/authorization/github" className="oauth-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Continue with GitHub
        </a>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
