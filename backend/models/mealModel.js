const mongoose = require('mongoose');

const mealSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['lunch', 'dinner'],
    },
    status: {
      type: String,
      required: true,
      enum: ['eaten', 'skipped', 'postponed'],
      default: 'skipped',
    },
    originalDate: {
      type: Date,
      // Only required if the meal is postponed
    },
  },
  {
    timestamps: true,
  }
);

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;