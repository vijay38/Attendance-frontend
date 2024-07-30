import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import UserDetailsPage from './pages/UserDetailsPage';
import AttendancePage from './pages/AttendancePage';
import { AuthProvider, useAuth } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import './index.css';

function Root() {
    return (
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
        </AuthProvider>
    );
}
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);