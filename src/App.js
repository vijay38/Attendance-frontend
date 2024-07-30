import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './styles/App.css';
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom';
function App() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    return (
        <div className="App">
            
            <nav className="nav-bar">
                <div className='nav-links'>
                <Link to="/userDetails" className="nav-link">User Details</Link>
                <Link to="/attendance" className="nav-link">Attendance</Link>
                </div>
                <button className="logout-button" onClick={() =>{logout();navigate('/login');}}>Logout</button>
            </nav>
            <Outlet />
        </div>
    );
}

export default App;
