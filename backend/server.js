const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Feedback = require('./models/feedback');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://greenbeancafe.onrender.com",
  methods: "GET,POST",
  credentials: true
}));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('Failed to connect to MongoDB...', err));

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, rating, message } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({ msg: 'Please fill in all fields.' });
    }

    const newFeedback = new Feedback({
      name,
      rating,
      message,
    });

    const savedFeedback = await newFeedback.save();

    res.status(201).json(savedFeedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.delete('/api/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Feedback deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);

});

