import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './styles/App.css';
import { useAuth } from './AuthContext'

function App() {
    const { logout } = useAuth();
    return (
        <div className="App">
            
            <nav className="nav-bar">
                <div className='nav-links'>
                <Link to="/userDetails" className="nav-link">User Details</Link>
                <Link to="/attendance" className="nav-link">Attendance</Link>
                </div>
                <button className="logout-button" onClick={logout}>Logout</button>
            </nav>
            <Outlet />
        </div>
    );
}

export default App;
