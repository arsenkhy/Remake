const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Movie = require('./models/movieModel');
require('dotenv').config();

const app = express();

// Set up CORS middleware
app.use(cors());
app.use(express.json());

// Define API routes
app.get('/', (req, res) => {
  const data = { message: 'Default page API' };
  res.json(data);
});

app.get('/api', (req, res) => {
  const data = { message: 'Hello from the API!' };
  res.json(data);
});

app.post('/uploadMovie', async (req, res) => {
  try {
    const movie = new Movie({
      title: req.body.title,
      year: req.body.year,
      images: req.body.images
    }); 

    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    console.error('Error creating movie', err);
    res.status(500).json({ message: 'Error creating movie' });
  }
});

app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.send(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5050;

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  })
  .catch(error => console.error(error));
