const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const apicache = require('apicache');
const mongoose = require('mongoose');
const Movie = require('./models/movieModel');
require('dotenv').config();

const app = express();
const cache = apicache.middleware;

// Set up CORS middleware
app.use(cors());
app.use(express.json());  

///////// FOR PRODUCTION ONLY ////////
// Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'build')));
//////////////////////////////////////

// Testing
app.get('/api', (req, res) => {
  const data = { message: 'Hello from the API!' };
  res.json(data);
});

app.get('/search', cache('5 minutes'), async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: '8baba8ab6b8bbe247645bcae7df63d0d',
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
