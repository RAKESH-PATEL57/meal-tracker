const Meal = require('../models/mealModel');
const User = require('../models/userModel');

// @desc    Record a meal (eaten or skipped)
// @route   POST /api/meals
// @access  Private
const recordMeal = async (req, res) => {
  try {
    const { date, type, status } = req.body;
    
    // Convert date string to Date object
    const mealDate = new Date(date);
    mealDate.setUTCHours(0, 0, 0, 0); // Normalize to start of day in UTC
    
    // Check if meal already exists for this date and type
    const existingMeal = await Meal.findOne({
      user: req.user._id,
      date: mealDate,
      type,
    });

    let mealUpdate;
    
    if (existingMeal) {
      // Store previous status
      const previousStatus = existingMeal.status;
      
      // Update existing meal
      existingMeal.status = status;
      mealUpdate = await existingMeal.save();
      
      // Update user's remaining meals if status changed
      if (previousStatus === 'eaten' && status !== 'eaten') {
        // If meal was eaten and now is not, add one meal back
        await updateRemainingMeals(req.user._id, 1);
      } else if (previousStatus !== 'eaten' && status === 'eaten') {
        // If meal was not eaten and now is, subtract one meal
        await updateRemainingMeals(req.user._id, -1);
      }
      // If status didn't change (e.g., skipped to skipped), no meal count update needed
    } else {
      // Create new meal record
      mealUpdate = await Meal.create({
        user: req.user._id,
        date: mealDate,
        type,
        status,
      });

      // If new meal is eaten, decrement remaining meals
      if (status === 'eaten') {
        await updateRemainingMeals(req.user._id, -1);
      }
    }
    
    // Get updated user stats
    const user = await User.findById(req.user._id);
    
    res.status(existingMeal ? 200 : 201).json({
      meal: mealUpdate,
      stats: {
        totalMeals: user.totalMeals,
        remainingMeals: user.remainingMeals,
        eatenMeals: user.totalMeals - user.remainingMeals
      }
    });
  } catch (error) {
    console.error('Meal recording error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get meals for a date range
// @route   GET /api/meals
// @access  Private
const getMeals = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {
      user: req.user._id,
    };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const meals = await Meal.find(query).sort({ date: 1 });
    res.json(meals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get meal stats (total eaten, remaining)
// @route   GET /api/meals/stats
// @access  Private
const getMealStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const totalEaten = user.totalMeals - user.remainingMeals;
    
    res.json({
      totalMeals: user.totalMeals,
      remainingMeals: user.remainingMeals,
      eatenMeals: totalEaten,
      startDate: user.startDate,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper function to update user's remaining meals
const updateRemainingMeals = async (userId, change) => {
  try {
    // Using findOneAndUpdate with $inc for atomic update
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { remainingMeals: change } },
      { new: true } // Return the updated document
    );
    
    // Ensure remainingMeals doesn't go below 0 or above totalMeals
    if (updatedUser.remainingMeals < 0) {
      updatedUser.remainingMeals = 0;
      await updatedUser.save();
    } else if (updatedUser.remainingMeals > updatedUser.totalMeals) {
      updatedUser.remainingMeals = updatedUser.totalMeals;
      await updatedUser.save();
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating remaining meals:', error);
    throw error;
  }
};

module.exports = {
  recordMeal,
  getMeals,
  getMealStats,
};