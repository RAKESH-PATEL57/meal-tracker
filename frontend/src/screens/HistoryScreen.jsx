import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import MealHistory from '../components/History/MealHistory';
import './HistoryScreen.css';

const HistoryScreen = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    fetchMealHistory();
  }, [user]);
  
  const fetchMealHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get date range for history (last 30 days)
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 30);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
        },
      };
      
      const response = await axios.get(`${API_URL}/api/meals`, config);
      setMeals(response.data);
      
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to load meal history'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-screen">
      <h1>Meal History</h1>
      
      {loading ? (
        <div className="loading">Loading history...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <MealHistory meals={meals} />
      )}
    </div>
  );
};

export default HistoryScreen;