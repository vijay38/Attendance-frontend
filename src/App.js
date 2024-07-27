import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './styles/App.css';

function App() {
    return (
        <div className="App">
            <nav>
                <Link to="/userDetails">User Details</Link>
                <Link to="/attendance">Attendance</Link>
            </nav>
            <Outlet />
        </div>
    );
}

export default App;
