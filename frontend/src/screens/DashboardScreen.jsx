import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import MealStats from '../components/Dashboard/MealStats';
import TodayMeals from '../components/Dashboard/TodayMeals';
import './DashboardScreen.css';

const DashboardScreen = () => {
  const [stats, setStats] = useState({
    totalMeals: 60,
    remainingMeals: 60,
    eatenMeals: 0,
    startDate: new Date(),
  });
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    fetchDashboardData();
  }, [user]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get today's date
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 7); // Get meals from last 7 days
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      // Make both requests in parallel for efficiency
      const [statsResponse, mealsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/meals/stats`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }),
        axios.get(`${API_URL}/api/meals`, {
          ...config,
          params: {
            startDate: startDate.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
          },
        })
      ]);
      
      setStats(statsResponse.data);
      setMeals(mealsResponse.data);
      
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to load dashboard data'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-screen">
      <h1>Dashboard</h1>
      
      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="dashboard-summary card">
            <p>
              You have a total of <strong>{stats.totalMeals}</strong> meals in your plan.
              Each day consists of two meals (lunch and dinner), and each consumed meal
              reduces your remaining meal count by 1.
            </p>
          </div>
          <MealStats stats={stats} />
          <TodayMeals 
            meals={meals} 
            fetchMeals={fetchDashboardData} 
            user={user} 
            stats={stats}
            setStats={setStats}
          />
        </>
      )}
    </div>
  );
};

export default DashboardScreen;