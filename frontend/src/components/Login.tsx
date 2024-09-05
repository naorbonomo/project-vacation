import React from 'react';
import { login } from '../api/authClientAPI';
import { useNavigate } from 'react-router-dom';

type Props = {
    setUser: (user: any) => void;
}

const Login: React.FC<Props> = ({ setUser }) => {
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const user = await login(email, password);

            // Store user in localStorage and update state
            if (user && user.userWithoutPassword) {
                localStorage.setItem('user', JSON.stringify(user.userWithoutPassword));  // Store user info in localStorage
                setUser(user.userWithoutPassword);  // Update user state
                alert("Hello " + user.userWithoutPassword.first_name);
                navigate('/');  // Navigate to home page after login
            } else {
                alert("Login failed, no user data found.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        }
    }

    return (
        <div>Login
            <form onSubmit={handleLogin}>
                <input placeholder='email' type='email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }} />
                <input placeholder='password' type='password' value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }} />

                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login;
