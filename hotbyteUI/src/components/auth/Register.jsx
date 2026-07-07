// Register Page - uses Formik + Yup validation
// strictly for Customer (role_id=2) registration
// Calls POST /api/auth/register which returns a JWT

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import './Register.css';

const ROLE_CUSTOMER = 2;

// Yup validation schema
const registerSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  contactNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits')
    .required('Contact number is required'),
  gender: Yup.string(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const Register = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      contactNumber: '',
      gender: 'Other',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      try {
        const payload = {
          roleId: ROLE_CUSTOMER,
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          contactNumber: values.contactNumber,
          gender: values.gender,
        };

        const response = await registerUser(payload);
        const data = response.data;

        // Store token in context
        localStorage.setItem('hotbyte_token', data.token);
        localStorage.setItem('hotbyte_user', JSON.stringify({
          userId: data.userId,
          email: data.email,
          fullName: data.fullName,
          roleName: data.roleName,
          roleId: data.roleId,
        }));

        toast.success(`Welcome to HotByte, ${data.fullName}!`);
        
        navigate('/menu');
      } catch (err) {
        const message = err.response?.data?.error || 'Registration failed. Please try again.';
        if (message.toLowerCase().includes('email')) {
          formik.setFieldError('email', message);
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

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#ef4444', '#f59e0b', '#22c55e', '#16a34a'];
    return { strength: score, label: labels[score], color: colors[score] };
  };

  const passwordStrength = getPasswordStrength(formik.values.password);

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-logo">
          <span className="brand-hot">Hot</span><span className="brand-byte">Byte</span>
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join HotByte and start ordering delicious food</p>

        {serverError && (
          <div className="error-banner"><span>{serverError}</span></div>
        )}

        <form onSubmit={formik.handleSubmit} className="auth-form register-form" noValidate>
          <div className="form-grid">
            {/* Full Name */}
            <div className="field-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName" name="fullName" type="text"
                className={getFieldClass('fullName')}
                placeholder="John Doe"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <span className="error-text">{formik.errors.fullName}</span>
              )}
            </div>

            {/* Email */}
            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email"
                className={getFieldClass('email')}
                placeholder="john@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="error-text">{formik.errors.email}</span>
              )}
            </div>

            {/* Contact Number */}
            <div className="field-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                id="contactNumber" name="contactNumber" type="tel"
                className={getFieldClass('contactNumber')}
                placeholder="10-digit mobile number"
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.contactNumber && formik.errors.contactNumber && (
                <span className="error-text">{formik.errors.contactNumber}</span>
              )}
            </div>

            {/* Gender */}
            <div className="field-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender" name="gender"
                className="input-field select-field"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              className={getFieldClass('password')}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.values.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="strength-segment"
                      style={{ background: i <= passwordStrength.strength ? passwordStrength.color : 'rgba(255,255,255,0.1)' }}
                    />
                  ))}
                </div>
                <span style={{ color: passwordStrength.color, fontSize: '0.8rem' }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            {formik.touched.password && formik.errors.password && (
              <span className="error-text">{formik.errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="field-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword" name="confirmPassword" type="password"
              className={getFieldClass('confirmPassword')}
              placeholder="Re-enter your password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <span className="error-text">{formik.errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={formik.isSubmitting || (Object.keys(formik.touched).length > 0 && !formik.isValid)}>
            {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
