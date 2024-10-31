import React from 'react';
import { login } from '../api/authClientAPI';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'; // Ensure this import is here
import { ToastProvider, useToast } from '../context/ToastContext';

type Props = {
    setUser: (user: any) => void;
}

const Login: React.FC<Props> = ({ setUser }) => {
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const user = await login(email, password);
            if (user && user.userWithoutPassword) {
                localStorage.setItem('user', JSON.stringify(user.userWithoutPassword));
                setUser(user.userWithoutPassword);
                showToast(`Hello, ${user.userWithoutPassword.first_name}`, 'success');
                navigate('/');
            } else {
                showToast('Login failed, no user data found.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Login failed. Please try again.', 'error');
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
