import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { format } from 'date-fns';
import './DayMeals.css';

const DayMeals = ({ selectedDate, meals, fetchMeals, user }) => {
  const [loading, setLoading] = useState(false);
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  // Find meals for the selected date
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
      
      await axios.post(
        `${API_URL}/api/meals`,
        {
          date: formattedDate,
          type,
          status,
        },
        config
      );
      
      // Refetch meals to update the UI
      fetchMeals();
      
    } catch (error) {
      console.error('Error updating meal status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="day-meals card">
      <h2>Meals for {format(selectedDate, 'EEEE, MMMM do, yyyy')}</h2>
      
      <div className="day-meals-container">
        <div className="day-meal-card">
          <div className="day-meal-header">
            <h3>Lunch</h3>
            <div className={`day-meal-status ${lunch.status}`}>
              {lunch.status === 'eaten' ? 'Eaten' : 
               lunch.status === 'skipped' ? 'Skipped' : 'Postponed'}
            </div>
          </div>
          
          <div className="day-meal-actions">
            <button 
              className={`day-btn-action ${lunch.status === 'eaten' ? 'active' : ''}`} 
              onClick={() => handleMealStatus('lunch', 'eaten')}
              disabled={loading}
            >
              Mark as Eaten
            </button>
            <button 
              className={`day-btn-action ${lunch.status === 'skipped' ? 'active' : ''}`} 
              onClick={() => handleMealStatus('lunch', 'skipped')}
              disabled={loading}
            >
              Mark as Skipped
            </button>
          </div>
        </div>
        
        <div className="day-meal-card">
          <div className="day-meal-header">
            <h3>Dinner</h3>
            <div className={`day-meal-status ${dinner.status}`}>
              {dinner.status === 'eaten' ? 'Eaten' : 
               dinner.status === 'skipped' ? 'Skipped' : 'Postponed'}
            </div>
          </div>
          
          <div className="day-meal-actions">
            <button 
              className={`day-btn-action ${dinner.status === 'eaten' ? 'active' : ''}`} 
              onClick={() => handleMealStatus('dinner', 'eaten')}
              disabled={loading}
            >
              Mark as Eaten
            </button>
            <button 
              className={`day-btn-action ${dinner.status === 'skipped' ? 'active' : ''}`} 
              onClick={() => handleMealStatus('dinner', 'skipped')}
              disabled={loading}
            >
              Mark as Skipped
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayMeals;