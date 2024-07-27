import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import UserDetailsPage from './pages/UserDetailsPage';
import AttendancePage from './pages/AttendancePage';
import { AuthProvider, useAuth } from './AuthContext';
import './index.css';

function PrivateRoute({ children }) {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? children : <Navigate to="/login" />;
}

ReactDOM.render(
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/">
                    <Route path="login" element={<LoginPage />} />
                    <Route
                        path="userDetails"
                        element={
                            <PrivateRoute>
                              <App />
                                <UserDetailsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="attendance"
                        element={
                            <PrivateRoute>
                              <App />
                                <AttendancePage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Route>
            </Routes>
        </Router>
    </AuthProvider>,
    document.getElementById('root')
);
