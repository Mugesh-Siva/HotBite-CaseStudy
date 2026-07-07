// AuthContext - manages JWT authentication state globally
// Stores: user info + JWT token in localStorage
// Provides: login(), logout(), isAuthenticated, user, token

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getCurrentUser } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // { userId, email, fullName, roleName, roleId }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start, restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('hotbyte_token');
    const storedUser = localStorage.getItem('hotbyte_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login: call API, store token + user in localStorage
  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    const data = response.data;

    localStorage.setItem('hotbyte_token', data.token);
    localStorage.setItem('hotbyte_user', JSON.stringify({
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
      roleName: data.roleName,
      roleId: data.roleId,
    }));

    setToken(data.token);
    setUser({
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
      roleName: data.roleName,
      roleId: data.roleId,
    });

    return data;
  };

  // Logout: clear localStorage and state
  const logout = () => {
    localStorage.removeItem('hotbyte_token');
    localStorage.removeItem('hotbyte_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  // Login with token (for OAuth2)
  const loginWithToken = async (newToken) => {
    localStorage.setItem('hotbyte_token', newToken);
    setToken(newToken);
    try {
      const response = await getCurrentUser();
      const userData = response.data;
      localStorage.setItem('hotbyte_user', JSON.stringify({
        userId: userData.userId,
        email: userData.email,
        fullName: userData.fullName,
        roleName: userData.roleName,
        roleId: userData.roleId,
      }));
      setUser({
        userId: userData.userId,
        email: userData.email,
        fullName: userData.fullName,
        roleName: userData.roleName,
        roleId: userData.roleId,
      });
    } catch (error) {
      console.error("Failed to fetch user with token", error);
      logout();
    }
  };

  const value = {
    user,
    token,
    login,
    loginWithToken,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
