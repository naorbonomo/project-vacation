import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface NavigationProps {
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated, user, onLogout }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {isAuthenticated && user ? (
          <>
            <li>Hello, {user.name}</li>
            {user.role === 'Admin' && (
              <>
                <li><Link to="/vacation-form">Add Vacation</Link></li>
                <li><Link to="/vacation-report">Vacation Report</Link></li> {/* Add the report link */}
              </>
            )}
            <li><button onClick={onLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
