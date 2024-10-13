import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import VacationList from './components/VacationList';
import Login from './components/Login';
import Register from './components/Register';
import VacationForm from './components/VacationForm';
import VacationEdit from './components/VacationEdit';
import CityAnimation from './components/CityAnimation';
import VacationReport from './components/VacationReport';
import LandingPage from './components/LandingPage'; // New component for the landing page
import APP_CONFIG from './utils/appconfig';
import './App.css'; 

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (user && !user.id && user.email) {
      fetchUserId(user.email);
    }
  }, [user]);

  const fetchUserId = async (email: string) => {
    try {
      console.log('Fetching user ID for email:', email);
      const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/user-id`, {
        params: { email },
      });
      const userId = response.data.user_id;

      // Merge the fetched ID with the existing user data
      const updatedUser = { ...user, id: userId };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div>
        <nav className={user?.role === 'Admin' ? 'admin-nav' : 'user-nav'}>
          <div className="brand">
            <Link to="/" className="brand-link">NaorBonomo.com</Link>
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/vacation-list">Vacations</Link> {/* Always visible to all users */}
              {user?.role === 'Admin' && (
                <>
                  <Link to="/vacation-form">Add Vacation</Link>
                  <Link to="/vacation-report">Vacation Report</Link>
                </>
              )}
            </div>
          </div>
          <div className="auth-links">
            {!user ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ) : (
              <>
                <span>
                  {user.role === 'Admin' ? (
                    <>Hello Administrator, {user.first_name} {user.last_name}</>
                  ) : (
                    <>Hello, {user.first_name} {user.last_name}</>
                  )}
                </span>
                <button onClick={logout}>Logout</button>
              </>
            )}
          </div>
        </nav>
  
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/vacation-list"
            element={
              isAuthenticated && user?.id ? (
                <VacationList user={user} />
              ) : (
                <div>Please log in to see vacations.</div>
              )
            }
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vacation-form" element={<VacationForm />} />
          <Route path="/vacation-form/:id" element={<VacationForm />} />
          <Route path="/vacation-edit/:id" element={<VacationEdit />} />
          {user?.role === 'Admin' && (
            <Route path="/vacation-report" element={<VacationReport />} />
          )}
        </Routes>
      </div>
    </Router>
  );
  
  
};

export default App;
