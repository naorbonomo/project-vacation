// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VacationList from './components/VacationList';
import Login from './components/Login';
import Register from './components/Register'; 
import VacationForm from './components/VacationForm'; 
import VacationEdit from './components/VacationEdit';
import CityAnimation from './components/CityAnimation'; // Import the CityAnimation component
import VacationReport from './components/VacationReport'; // Import the VacationReport component

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div>
        <CityAnimation /> {/* Add CityAnimation at the top of the page */}
        <nav>
  <ul>
    <li><Link to="/">Home</Link></li>
    {!user ? (
      <>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </>
    ) : (
      <>
        <li>Hello, {user.first_name}</li>
        {user.role === 'Admin' && (
          <>
            <li><Link to="/vacation-form">Add Vacation</Link></li>
            <li><Link to="/vacation-report">Vacation Report</Link></li> {/* Link for admin */}
          </>
        )}
        <li><button onClick={logout}>Logout</button></li>
      </>
    )}
  </ul>
</nav>

        <Routes> 
          <Route path="/" element={isAuthenticated ? <VacationList user={user}/> : <div>Please log in to see vacations.</div>} />  
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
