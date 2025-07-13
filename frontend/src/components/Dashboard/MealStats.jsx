import React from 'react';
import './MealStats.css';

const MealStats = ({ stats }) => {
  const { totalMeals, remainingMeals, eatenMeals } = stats;
  const percentEaten = (eatenMeals / totalMeals) * 100;
  
  return (
    <div className="meal-stats card">
      <h2>Meal Plan Statistics</h2>
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-value">{totalMeals}</div>
          <div className="stat-label">Total Meals</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value remaining">{remainingMeals}</div>
          <div className="stat-label">Remaining</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value eaten">{eatenMeals}</div>
          <div className="stat-label">Consumed</div>
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${percentEaten}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {percentEaten.toFixed(0)}% consumed
        </div>
      </div>
    </div>
  );
};

export default MealStats;