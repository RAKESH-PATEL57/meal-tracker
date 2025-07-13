const express = require('express');
const {
  recordMeal,
  getMeals,
  getMealStats,
} = require('../controllers/mealController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, recordMeal)
  .get(protect, getMeals);
  
router.get('/stats', protect, getMealStats);

module.exports = router;