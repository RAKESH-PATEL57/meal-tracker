import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div className="theme-toggle">
      <button 
        onClick={toggleTheme} 
        className="theme-toggle-btn"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <span className="toggle-icon">🌙</span>
        ) : (
          <span className="toggle-icon">☀️</span>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;