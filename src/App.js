import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './styles/App.css';
import { useAuth } from './AuthContext';

function App() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="App">
      <nav className="nav-bar">
        {/* Desktop nav */}
        <div className="desktop-nav">
          <Link to="/userDetails" className="nav-item nav-link">User Details</Link>
          <Link to="/attendance" className="nav-item nav-link">Attendance</Link>
          <Link to="/family" className="nav-item nav-link">Family</Link>
          <button className="nav-item logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile nav */}
        <div className="mobile-nav">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          {menuOpen && (
            <div className="mobile-menu">
              <Link to="/userDetails" className="nav-link" onClick={() => setMenuOpen(false)}>User Details</Link>
              <Link to="/attendance" className="nav-link" onClick={() => setMenuOpen(false)}>Attendance</Link>
              <Link to="/family" className="nav-link" onClick={() => setMenuOpen(false)}>Family</Link>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
