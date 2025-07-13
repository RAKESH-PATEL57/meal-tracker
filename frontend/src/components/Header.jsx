import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>MealTracker</h1>
        </Link>
        <nav className="nav">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/calendar" className="nav-link">Calendar</Link>
              <Link to="/history" className="nav-link">History</Link>
              <div className="dropdown">
                <button className="dropdown-btn">
                  {user.name} <i className="fas fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;