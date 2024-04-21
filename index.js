const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./app/routes/auth');
const expenseRoutes = require('./app/routes/expenses');
const cors = require('cors');
dotenv.config();
const app = express();

app.use(express.json()); 
app.use('/api', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use(express.static('frontend'));
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

