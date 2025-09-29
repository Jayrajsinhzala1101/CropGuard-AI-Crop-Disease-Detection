import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:8000';
  axios.defaults.withCredentials = true;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const response = await axios.get('/api/user/');
      // Backend returns user data directly
      console.log('Auth check successful:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.log('User not authenticated:', error.response?.status, error.response?.data);
      console.log('Error details:', error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, first_name = '', last_name = '') => {
    try {
      const response = await axios.post('/api/register/', {
        email,
        password,
        first_name,
        last_name
      });
      
      // Backend returns user data directly on success
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login...');
      const response = await axios.post('/api/login/', {
        email,
        password
      });
      
      console.log('Login successful:', response.data);
      console.log('Cookies:', document.cookie);
      
      // Backend returns user data directly on success
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.log('Login failed:', error.response?.status, error.response?.data);
      const message = error.response?.data?.error || 'Login failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout/');
      setUser(null);
      return { success: true, message: 'Logout successful' };
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      return { success: true, message: 'Logout successful' };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 