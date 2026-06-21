// React context that provides authentication state and actions (login, logout, register)
// to the entire application. Persists the user session in localStorage so it
// survives page reloads.

import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize user state from localStorage (persists across page reloads)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('nhc_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Authenticates with the backend, stores the JWT token and user profile
  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem('nhc_token', data.token);
    localStorage.setItem('nhc_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  // Clears the stored token and user profile
  const logout = useCallback(() => {
    localStorage.removeItem('nhc_token');
    localStorage.removeItem('nhc_user');
    setUser(null);
  }, []);

  // Registers a new account (does not log in — account requires admin approval)
  const register = useCallback(async (email, password) => {
    return registerUser(email, password);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access auth state and actions from any component
export function useAuth() {
  return useContext(AuthContext);
}
