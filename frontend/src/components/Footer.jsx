import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Meal Tracker App created by Rakesh-Patel-57 (Odisha)</p>
      </div>
    </footer>
  );
};

export default Footer;