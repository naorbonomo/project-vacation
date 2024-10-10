// frontend/src/components/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import './Navigation.css';

interface NavigationProps {
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated, user, onLogout }) => {
  return (
    <nav>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {isAuthenticated && user && user.role === 'Admin' && (
          <>
            <Link to="/vacation-form">Add Vacation</Link>
            <Link to="/vacation-report">Vacation Report</Link>
          </>
        )}
      </div>
      <div className="auth-links">
        {isAuthenticated && user ? (
          <>
            <span>Hello, {user.name}</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
