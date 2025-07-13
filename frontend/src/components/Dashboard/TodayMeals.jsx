import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { format } from 'date-fns';
import './TodayMeals.css';

const TodayMeals = ({ meals, fetchMeals, user, stats, setStats }) => {
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const formattedDate = format(today, 'yyyy-MM-dd');
  
  // Find today's lunch and dinner
  const lunch = meals.find(
    meal => meal.type === 'lunch' && format(new Date(meal.date), 'yyyy-MM-dd') === formattedDate
  ) || { status: 'skipped' };
  
  const dinner = meals.find(
    meal => meal.type === 'dinner' && format(new Date(meal.date), 'yyyy-MM-dd') === formattedDate
  ) || { status: 'skipped' };

  const handleMealStatus = async (type, status) => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      // Get the current meal status before update
      const currentMeal = type === 'lunch' ? lunch : dinner;
      const currentStatus = currentMeal.status;
      
      await axios.post(
        `${API_URL}/api/meals`,
        {
          date: formattedDate,
          type,
          status,
        },
        config
      );
      
      // Immediately update local stats based on the change
      // If meal was not eaten before and now is eaten, decrease remaining
      if (currentStatus !== 'eaten' && status === 'eaten') {
        setStats(prev => ({
          ...prev,
          remainingMeals: prev.remainingMeals - 1,
          eatenMeals: prev.eatenMeals + 1
        }));
      } 
      // If meal was eaten before and now is not eaten, increase remaining
      else if (currentStatus === 'eaten' && status !== 'eaten') {
        setStats(prev => ({
          ...prev,
          remainingMeals: prev.remainingMeals + 1,
          eatenMeals: prev.eatenMeals - 1
        }));
      }
      
      // Refetch all data to ensure everything is in sync
      await fetchMeals();
      
    } catch (error) {
      console.error('Error updating meal status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="today-meals card">
      <h2>Today's Meals</h2>
      <p className="today-date">{format(today, 'EEEE, MMMM do, yyyy')}</p>
      
      <div className="meals-container">
        <div className="meal-card">
          <div className="meal-header">
            <h3>Lunch</h3>
            <div className={`meal-status ${lunch.status}`}>
              {lunch.status === 'eaten' ? 'Eaten' : 
               lunch.status === 'skipped' ? 'Skipped' : 'Postponed'}
            </div>
          </div>
          
          <div className="meal-info">
            <p>Each meal consumed reduces your remaining meal count by 1</p>
          </div>
          
          <div className="meal-actions">
            <button 
              className={`btn-action ${lunch.status === 'eaten' ? 'active' : ''}`} 
              onClick={() => handleMealStatus('lunch', 'eaten')}
              disabled={loading}
            >
              Mark as Eaten
            </button>
            <button 
              className={`btn-action ${lunch.status === 'skipped' ? 'active' : ''}`} 
              onClick={() => handleMealStatus('lunch', 'skipped')}
              disabled={loading}
            >
              Mark as Skipped
            </button>
          </div>
        </div>
        
        <div className="meal-card">
          <div className="meal-header">
            <h3>Dinner</h3>
            <div className={`meal-status ${dinner.status}`}>
              {dinner.status === 'eaten' ? 'Eaten' : 
               dinner.status === 'skipped' ? 'Skipped' : 'Postponed'}
            </div>
          </div>
          
          <div className="meal-info">
            <p>Each meal consumed reduces your remaining meal count by 1</p>
          </div>
          
          <div className="meal-actions">
            <button 
              className={`btn-action ${dinner.status === 'eaten' ? 'active' : ''}`} 
              onClick={() => handleMealStatus('dinner', 'eaten')}
              disabled={loading}
            >
              Mark as Eaten
            </button>
            <button 
              className={`btn-action ${dinner.status === 'skipped' ? 'active' : ''}`} 
              onClick={() => handleMealStatus('dinner', 'skipped')}
              disabled={loading}
            >
              Mark as Skipped
            </button>
          </div>
        </div>
      </div>
      
      <div className="meal-summary">
        <p>Your meal count: <strong>{stats.totalMeals}</strong></p>
        <p>Remaining meals: <strong>{stats.remainingMeals}</strong></p>
        <p>Consumed meals: <strong>{stats.eatenMeals}</strong></p>
      </div>
    </div>
  );
};

export default TodayMeals;