import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Detect from './pages/Detect';
import Loading from './components/Loading';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Configure axios
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/detect" 
          element={user ? <Detect /> : <Navigate to="/" />} 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
          <Navbar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pt-20"
          >
            <AppRoutes />
          </motion.main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 