import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [formError, setFormError] = useState('');
  
  const { user, updateProfile, loading, error } = useContext(AuthContext);
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setMessage(null);
    
    // Validate form
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Update profile
    try {
      const userData = {
        name,
        email,
      };
      
      if (password) {
        userData.password = password;
      }
      
      await updateProfile(userData);
      setMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Error is already handled in the context
    }
  };

  return (
    <div className="profile-screen">
      <h1>User Profile</h1>
      
      <div className="profile-container">
        <div className="profile-card">
          <h2>Update Your Information</h2>
          
          {message && <div className="alert alert-success">{message}</div>}
          {formError && <div className="alert alert-danger">{formError}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-control">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-control">
              <label htmlFor="password">New Password (leave blank to keep current)</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            
            <div className="form-control">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            
            <button 
              type="submit" 
              className="profile-btn" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
        
        <div className="profile-stats-card">
          <h2>Your Meal Plan</h2>
          
          <div className="profile-stats">
            <div className="profile-stat-item">
              <div className="stat-label">Total Meals</div>
              <div className="stat-value">{user?.totalMeals || 60}</div>
            </div>
            
            <div className="profile-stat-item">
              <div className="stat-label">Remaining Meals</div>
              <div className="stat-value">{user?.remainingMeals || 60}</div>
            </div>
            
            <div className="profile-stat-item">
              <div className="stat-label">Start Date</div>
              <div className="stat-value">
                {user?.startDate ? new Date(user.startDate).toLocaleDateString() : 'Not set'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;