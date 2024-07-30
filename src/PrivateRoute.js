import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

// Define your API base URL
const BASE_URL = 'http://localhost:5000';

function PrivateRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null to handle loading state
    const [loading, setLoading] = useState(true); // Handle loading state

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    // Send the token to the backend for verification
                    const response = await axios.post(`${BASE_URL}/api/verifyToken`, { token });

                    if (response.data.valid) {
                        setIsAuthenticated(true); // Token is valid
                    } else {
                        setIsAuthenticated(false); // Token is not valid
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    setIsAuthenticated(false); // Handle error or token invalidity
                }
            } else {
                setIsAuthenticated(false); // No token found
            }

            setLoading(false); // Done loading
        };

        verifyToken();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // You can customize the loading indicator
    }

    if (isAuthenticated) {
        return children; // Render the children if authenticated
    } else {
        return <Navigate to="/login" />; // Redirect to login if not authenticated
    }
}

export default PrivateRoute;
