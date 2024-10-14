// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';

// define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;  // explicitly define the function
  setIsAdmin: (isAdmin: boolean) => void;  
  login: (token: string, isAdmin: boolean | undefined) => void;
  logout: () => void;
}

// create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { //anything that can be rendered in a react component.
  // state for authentication status and admin status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // effect to check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(storedIsAdmin === 'true');
    }
  }, []);

  // function to handle user login
  const login = (token: string, isAdmin: boolean | undefined) => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
      setIsAuthenticated(true);
      setIsAdmin(!!isAdmin);
    } else {
      console.error('Login failed: No token provided');
    }
  };

  // function to handle user logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // provide the auth context to child components
  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, setIsAuthenticated, setIsAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};