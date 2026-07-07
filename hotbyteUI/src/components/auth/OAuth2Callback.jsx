import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // We got a token, log the user in!
      loginWithToken(token);
      toast.success('Successfully logged in with GitHub!');
      navigate('/');
    } else {
      toast.error('OAuth2 login failed. No token received.');
      navigate('/login');
    }
  }, [location, navigate, loginWithToken]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
      <h2>Authenticating with GitHub...</h2>
    </div>
  );
};

export default OAuth2Callback;
