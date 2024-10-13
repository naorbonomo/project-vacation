import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import APP_CONFIG from '../utils/appconfig';
import './AuthForm.css';

const Register: React.FC = () => {
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const [emailError, setEmailError] = useState(false); // Email error state
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setEmailError(false); // Reset email error state before each submission

        try {
            await axios.post(`${APP_CONFIG.API_BASE_URL}/api/register`, {
                first_name,
                last_name,
                email,
                password,
            });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error: any) {
            console.error('Error details:', error.response);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
                if (error.response.data.includes('User already exists')) {
                    setEmailError(true); // Trigger email error state
                }
            } else {
                setErrorMessage('Registration failed. Please try again.');
            }
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError(false); // Reset the error state when the user starts typing
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
                            onChange={handleEmailChange} // Call the updated onChange handler
                            required 
                            className={emailError ? 'input-error' : ''} // Apply error class conditionally
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
