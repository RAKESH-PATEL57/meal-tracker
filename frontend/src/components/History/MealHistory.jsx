import React from 'react';
import { format } from 'date-fns';
import './MealHistory.css';

const MealHistory = ({ meals }) => {
  // Sort meals by date (newest first)
  const sortedMeals = [...meals].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Group meals by date
  const mealsByDate = sortedMeals.reduce((acc, meal) => {
    const dateStr = format(new Date(meal.date), 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(meal);
    return acc;
  }, {});

  return (
    <div className="meal-history">
      <h2>Meal History</h2>
      
      {Object.keys(mealsByDate).length === 0 ? (
        <div className="no-history">
          <p>No meal history found. Start tracking your meals!</p>
        </div>
      ) : (
        <div className="history-list">
          {Object.entries(mealsByDate).map(([dateStr, dayMeals]) => (
            <div key={dateStr} className="history-day-card">
              <div className="history-day-header">
                <h3>{format(new Date(dateStr), 'EEEE, MMMM do, yyyy')}</h3>
              </div>
              
              <div className="history-meals">
                {dayMeals.map(meal => (
                  <div key={meal._id || `${meal.type}-${dateStr}`} className="history-meal-item">
                    <div className="history-meal-type">
                      {meal.type === 'lunch' ? 'Lunch' : 'Dinner'}
                    </div>
                    <div className={`history-meal-status ${meal.status}`}>
                      {meal.status === 'eaten' ? 'Eaten' : 
                       meal.status === 'skipped' ? 'Skipped' : 'Postponed'}
                    </div>
                    {meal.status === 'postponed' && meal.originalDate && (
                      <div className="history-meal-note">
                        Originally from {format(new Date(meal.originalDate), 'MMM do')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealHistory;