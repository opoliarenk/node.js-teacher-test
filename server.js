//////////////////////////////////

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Підключення до бази даних MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@poliarnyolen.ppikl6h.mongodb.net/`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Connection to MongoDB failed:', error);
  });


app.use(cors());
app.use(express.json());

// Використання роутів пов'язаних з книгами
app.use('/', bookRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//////////////////////////////////
