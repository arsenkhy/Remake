const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  day: { type: Number, required: true, unique: true },
  movieID: { type: Number, required: true },
  images: { type: [String], required: true }
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
