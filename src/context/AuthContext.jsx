import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('jais_cart_token') || null);
  const [loading, setLoading] = useState(true);

  // Check initial token on mount
  useEffect(() => {
    async function verifyExistingToken() {
      if (token) {
        try {
          const res = await api.getMe(token);
          if (res.success) {
            setUser(res.user);
          } else {
            // Expired token
            localStorage.removeItem('jais_cart_token');
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.error("Token verification error:", err);
        }
      }
      setLoading(false);
    }
    verifyExistingToken();
  }, [token]);

  const signup = async (username, phoneOrEmail, password) => {
    const res = await api.signup(username, phoneOrEmail, password);
    if (res.success) {
      localStorage.setItem('jais_cart_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const login = async (phoneOrEmailOrUsername, password) => {
    const res = await api.login(phoneOrEmailOrUsername, password);
    if (res.success) {
      localStorage.setItem('jais_cart_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('jais_cart_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
