import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import APP_CONFIG from '../utils/appconfig';
import './AuthForm.css'; // Ensure this import is here

const Register: React.FC = () => {
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${APP_CONFIG.API_BASE_URL}/api/register`, {
                first_name,
                last_name,
                email,
                password,
            });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="First Name" 
                        value={first_name} 
                        onChange={(e) => setFirst_name(e.target.value)} 
                        required 
                    />
                    <input 
                        type="text" 
                        placeholder="Last Name" 
                        value={last_name} 
                        onChange={(e) => setLast_name(e.target.value)} 
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
