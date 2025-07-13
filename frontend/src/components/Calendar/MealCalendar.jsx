import React, { useState, useContext } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { ThemeContext } from '../../context/ThemeContext';
import 'react-calendar/dist/Calendar.css';
import './MealCalendar.css';

const MealCalendar = ({ meals, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { theme } = useContext(ThemeContext);
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  // Function to add custom content to calendar tiles
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayMeals = meals.filter(meal => 
      format(new Date(meal.date), 'yyyy-MM-dd') === formattedDate
    );
    
    if (dayMeals.length === 0) return null;
    
    const lunch = dayMeals.find(meal => meal.type === 'lunch');
    const dinner = dayMeals.find(meal => meal.type === 'dinner');

    return (
      <div className="tile-content">
        {lunch && (
          <div 
            className={`meal-indicator ${lunch.status}`} 
            title={`Lunch: ${lunch.status}`}
          >
            L
          </div>
        )}
        {dinner && (
          <div 
            className={`meal-indicator ${dinner.status}`} 
            title={`Dinner: ${dinner.status}`}
          >
            D
          </div>
        )}
      </div>
    );
  };

  // Add custom class to dates with meals
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayMeals = meals.filter(meal => 
      format(new Date(meal.date), 'yyyy-MM-dd') === formattedDate
    );
    
    if (dayMeals.length === 0) return null;
    
    return 'has-meals';
  };

  return (
    <div className={`meal-calendar card theme-${theme}`}>
      <h2>Meal Calendar</h2>
      <p className="calendar-info">Select a date to view or update meals</p>
      <Calendar 
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        className="react-calendar"
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={false}
      />
    </div>
  );
};

export default MealCalendar;