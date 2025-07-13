import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Track Your Meals <span>Effortlessly</span></h1>
          <p>
            A simple and intuitive way to track your meal plan consisting of 60 meals.
            Mark meals as eaten or skipped, with skipped meals automatically
            postponed to the next day.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            {/* Image placeholder */}
            <div className="placeholder-text">Meal Tracking Made Simple</div>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track 60 Meals</h3>
            <p>Monitor your 60-meal plan with a simple and intuitive dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🍽️</div>
            <p>Record daily consumption with ease - lunch and dinner separately.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📆</div>
            <h3>Calendar View</h3>
            <p>Visualize your meal history and plan ahead with the calendar.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Postpone Skipped Meals</h3>
            <p>Skipped meals are automatically postponed to the next day.</p>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Ready to Start Tracking?</h2>
        <p>Sign up now and take control of your meal plan today.</p>
        <Link to="/register" className="btn-primary">Create Account</Link>
      </div>
    </div>
  );
};

export default HomeScreen;