import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';
import { useAuth } from '../AuthContext';
const BASE_URL = 'https://api.emmanuelministrieshyd.com';
function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!username || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/login`, { username, password });
            localStorage.setItem('token', response.data.token); // Store token in localStorage
            localStorage.setItem('userId',response.data.userId);
            login();
            navigate('/userDetails'); // Redirect to UserDetailsPage upon successful login
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid username or password.'); // Set error message for invalid credentials
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="error-message">{error}</p>} {/* Display error message if there is an error */}
                <button type="submit" disabled={!username || !password} className={username && password ? '':'disabled'}>Submit</button> {/* Disable button if fields are empty */}
            </form>
        </div>
    );
}

export default LoginPage;
