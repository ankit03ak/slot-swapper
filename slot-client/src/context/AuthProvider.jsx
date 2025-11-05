import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api.js';

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [user]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token); setUser(data.user);
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    setToken(data.token); setUser(data.user);
  };

  const logout = () => { setToken(null); setUser(null); };

  return (
    <AuthCtx.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);