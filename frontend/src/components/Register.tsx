// backend/src/components/Register.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import APP_CONFIG from '../utils/appconfig';

const Register: React.FC = () => {
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//   const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      // Log the form data
  console.log({
    first_name,
    last_name,
    email,
    password
  });
    try {
      const response = await axios.post(`${APP_CONFIG.API_BASE_URL}/api/register`, { first_name, last_name, email, password });
    //   const { token, isAdmin } = response.data;
    //   login(token, isAdmin);
      // Redirect to home page or vacations list
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={first_name}
        onChange={(e) => setFirst_name(e.target.value)}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        value={last_name}
        onChange={(e) => setLast_name(e.target.value)}
        placeholder="Last Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;