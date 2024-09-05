import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VacationList from './components/VacationList';
import Login from './components/Login';
import Register from './components/Register'; 
import VacationForm from './components/VacationForm'; 
import VacationEdit from './components/VacationEdit';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Track the logged-in user
  const isAuthenticated = !!localStorage.getItem('token');  // Check if token exists

  // Set the user state from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Parse and set the user from localStorage
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');  // Remove token
    localStorage.removeItem('user');   // Remove user info
    setUser(null);  // Reset user state
    window.location.href = '/login';   // Redirect to login after logout
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {!user ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/vacation-form">Add Vacation</Link></li> 
              </>
            ) : (
              <>
                <li>Hello, {user.first_name}</li>  {/* Display Hello with first name */}
                <li><button onClick={logout}>Logout</button></li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={isAuthenticated ? <VacationList /> : <div>Please log in to see vacations.</div>} /> {/* Restrict access to vacations */}
          <Route path="/login" element={<Login setUser={setUser} />} />  {/* Pass setUser to login */}
          <Route path="/register" element={<Register />} />
          <Route path="/vacation-form" element={<VacationForm />} /> 
          <Route path="/vacation-form/:id" element={<VacationForm />} /> 
          <Route path="/vacation-edit/:id" element={<VacationEdit />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
