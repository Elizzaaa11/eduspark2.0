import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eduspark_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('eduspark_token');
      const savedUser = localStorage.getItem('eduspark_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('eduspark_token', jwtToken);
    localStorage.setItem('eduspark_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('eduspark_token');
    localStorage.removeItem('eduspark_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
