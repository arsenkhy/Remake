import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import allowedMovies from './data/allowed_movies.json';
import './SearchBar.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchMovieTitles = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: '8baba8ab6b8bbe247645bcae7df63d0d',
            query: searchTerm
          }
        });
        const matches = response.data.results.filter(movie => allowedMovies.movies.includes(movie.title));
        const titles = matches.map(movie => movie.title);
        setOptions(titles);
      } catch (error) {
        console.error(error);
      }
    };      
    fetchMovieTitles();
  }, [searchTerm]);

  const handleFormSubmit = event => {
    event.preventDefault();
    // Do something with the search term, e.g. fetch search results
    console.log(searchTerm);
  };

  return (
    <form className="search-container" onSubmit={handleFormSubmit}>
      <Autocomplete
        freeSolo
        options={options}
        renderInput={params => (
          <TextField
            {...params}
            className="search-input"
            label="Search movie titles"
            variant="outlined"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            InputProps={{
              ...params.InputProps,
              className: 'search-input',
            }}
          />
        )}
        renderOption={option => <div className="search-option">{option}</div>}
        getOptionLabel={option => option}
        popupIcon={<div className="search-indicator">&#x25BC;</div>}
      />
      <button className="search-button" type="submit">Search</button>
    </form>
  );
};

export default Search;
