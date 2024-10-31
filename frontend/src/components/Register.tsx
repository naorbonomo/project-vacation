import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import APP_CONFIG from '../utils/appconfig';
import './AuthForm.css';
import { useToast } from '../context/ToastContext';

const Register: React.FC = () => {
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setEmailError(false);

        try {
            await axios.post(`${APP_CONFIG.API_BASE_URL}/api/register`, {
                first_name,
                last_name,
                email,
                password,
            });
            showToast('Registration successful! Please log in.', 'success');
            navigate('/login');
        } catch (error: any) {
            console.error('Error details:', error.response);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
                if (error.response.data.includes('User already exists')) {
                    setEmailError(true);
                    showToast('User already exists with this email', 'error');
                }
            } else {
                setErrorMessage('Registration failed. Please try again.');
                showToast('Registration failed. Please try again.', 'error');
            }
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError(false);
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
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={handleEmailChange}
                            required 
                            className={emailError ? 'input-error' : ''}
                        />
                        {emailError && <span className="error-message">User already exists with this email</span>}
                    </div>
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
