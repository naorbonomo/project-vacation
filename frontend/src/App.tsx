import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import VacationList from './components/VacationList';
import Login from './components/Login';
import Register from './components/Register'; // Assuming you have this component

const Navigation: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {!isAuthenticated ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <li><button onClick={logout}>Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navigation />
          <Routes>
            <Route path="/" element={<VacationList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
