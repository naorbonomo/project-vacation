import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate  } from 'react-router-dom';
import axios from 'axios';
import VacationList from './components/VacationList';
import Login from './components/Login';
import Register from './components/Register';
import VacationForm from './components/VacationForm';
import VacationEdit from './components/VacationEdit';
import CityAnimation from './components/CityAnimation';
import VacationReport from './components/VacationReport';
import LandingPage from './components/LandingPage'; 
import APP_CONFIG from './utils/appconfig';
import './App.css'; 
import VacationRecommendation from './components/VacationRecommendation';
import { ToastProvider } from './context/ToastContext';

const App: React.FC = () => {
  
  const [user, setUser] = useState<any>(null);// state to store user information
  
  const isAuthenticated = !!localStorage.getItem('token');// check if user is authenticated based on the presence of a token in localStorage

  // effect to load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // effect to fetch user id if it's not available but email is
  useEffect(() => {
    if (user && !user.id && user.email) {
      fetchUserId(user.email);
    }
  }, [user]);

  // function to fetch user id from the server
  const fetchUserId = async (email: string) => {
    try {
      console.log('Fetching user ID for email:', email);
      const response = await axios.get(`${APP_CONFIG.API_BASE_URL}/api/user-id`, {
        params: { email },
      });
      const userId = response.data.user_id;

      // merge the fetched ID with the existing user data
      const updatedUser = { ...user, id: userId };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  // function to handle user logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <ToastProvider>
        <div>
        {/* navigation bar with conditional rendering based on user role */}
        <nav className={user?.role === 'Admin' ? 'admin-nav' : 'user-nav'}>
          <div className="brand">
            <Link to="/" className="brand-link">NaorBonomo.com</Link>
            <div className="nav-links">
              {/* only show vacations button if user is logged in */}
              {user && (
                <>
                  <Link to="/vacation-list">Vacations</Link> {/* visible to all logged-in users */}
                  <Link to="/vacation-recommendation">Find Vacation</Link> 

                  {user?.role === 'Admin' && (
                    <>
                      <Link to="/vacation-form">Add Vacation</Link>
                      <Link to="/vacation-report">Vacation Report</Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="auth-links">
            {/* conditional rendering of login/register or user info and logout */}
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

        {/* route definitions */}
        <Routes>
          {/* redirect logged-in users to VacationList */}
          <Route
            path="/"
            element={
              isAuthenticated && user?.id ? (
                <Navigate to="/vacation-list" />
              ) : (
                <LandingPage />
              )
            }
          />
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
          {/* only render vacation report route for admin users */}
          {user?.role === 'Admin' && (
            <Route path="/vacation-report" element={<VacationReport />} />
          )}
            <Route path="/vacation-recommendation" element={<VacationRecommendation />} />

        </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
};

export default App;