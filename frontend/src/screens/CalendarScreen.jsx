import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import MealCalendar from '../components/Calendar/MealCalendar';
import DayMeals from '../components/Calendar/DayMeals';
import './CalendarScreen.css';

const CalendarScreen = () => {
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    fetchMeals();
  }, [user]);
  
  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get date range for current month plus/minus a few days
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      };
      
      const response = await axios.get(`${API_URL}/api/meals`, config);
      setMeals(response.data);
      
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to load meal data'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="calendar-screen">
      {/* <h1>Meal Calendar</h1> */}
      
      {loading ? (
        <div className="loading">Loading calendar...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <MealCalendar 
            meals={meals} 
            onDateSelect={handleDateSelect} 
          />
          <DayMeals 
            selectedDate={selectedDate} 
            meals={meals} 
            fetchMeals={fetchMeals} 
            user={user} 
          />
        </>
      )}
    </div>
  );
};

export default CalendarScreen;