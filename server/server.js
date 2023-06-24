require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const apicache = require('apicache');
const mongoose = require('mongoose');
const Movie = require('./models/movieModel');

const app = express();
const cache = apicache.middleware;

// Set up CORS middleware
app.use(cors());
app.use(express.json());  

///////// FOR PRODUCTION ONLY ////////
// Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'build')));
//////////////////////////////////////

// Environment variables
const PORT = process.env.PORT || 5050;
const MOVIE_API_URL = process.env.MOVIE_API_URL;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;


// Testing
app.get('/api', (req, res) => {
  const data = { message: 'Hello from the API!' };
  res.json(data);
});

app.get('/search', cache('5 minutes'), async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(MOVIE_API_URL, {
      params: {
        api_key: MOVIE_API_KEY,
        query: query
      }
    });

    const popularMovies = response.data.results.filter(movie => movie.popularity > 20).slice(0, 5).map(movie => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date
    }));
    
    res.json(popularMovies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});




app.post('/uploadMovie', async (req, res) => {
  try {
    const day = req.body.day;
    const existingMovie = await Movie.findOne({ day });
    if (existingMovie) {
      return res.status(400).json({ message: 'Movie with this day already exists' });
    }

    const movie = new Movie({
      day,
      movieID: req.body.movieID,
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

app.get('/movies/day/:day', async (req, res) => {
  try {
    const movie = await Movie.findOne({ day: req.params.day });
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
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  })
  .catch(error => console.error(error));
