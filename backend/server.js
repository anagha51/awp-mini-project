// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the Feedback model
const Feedback = require('./models/feedback');

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Allow requests from other origins (our frontend)
app.use(cors());
// Allow our app to understand JSON
app.use(express.json());

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('Failed to connect to MongoDB...', err));


app.post('/api/feedback', async (req, res) => {
  try {
    const { name, rating, message } = req.body;

    // Simple validation
    if (!name || !rating || !message) {
      return res.status(400).json({ msg: 'Please fill in all fields.' });
    }

    // Create a new feedback instance
    const newFeedback = new Feedback({
      name,
      rating,
      message,
    });

    // Save it to the database
    const savedFeedback = await newFeedback.save();

    // Respond with the saved data
    res.status(201).json(savedFeedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback, sorted by newest
 */
app.get('/api/feedback', async (req, res) => {
  try {
    // Find all feedback and sort it with the newest first
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});