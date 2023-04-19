import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import allowedMovies from './data/allowed_movies.json';
import ImageDisplay from '../ImageDisplay/ImagesButtons';
import Image from '../ImageDisplay/Image';
import './SearchBar.css';

const imageUrls = [
  'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg',
  'https://images.freeimages.com/images/previews/ac9/railway-hdr-1361893.jpg',
  'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg'
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [submitCount, setSubmitCount] = useState(0);
  const [selectedImageURL, setSelectedImageURL] = useState();
  const [imageDisplays, setImageDisplays] = useState([]);
  

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
    if (submitCount < 3) {
      setImageDisplays([...imageDisplays, <ImageDisplay key={imageDisplays.length + 1} imageNumber={imageDisplays.length + 1} imageURL={imageUrls[submitCount]} setSelectedImageURL={setSelectedImageURL} />]);
      setSubmitCount(submitCount + 1);
    }
  };

  useEffect(() => {
    const newButton = document.querySelector('.image-button:last-child');
    if (newButton) {
      newButton.click();
    }
  }, [imageDisplays]);
  


  useEffect(() => {
    handleFormSubmit({preventDefault: () => {}})
  }, []);

  return (
    <div>
      <Image imageURL={selectedImageURL}/>
      <div className='selection-wrapper'>
        {imageDisplays.map(imageDisplay => imageDisplay)}
      </div>
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
        <button className="search-button" type="submit">Submit</button>
      </form>
    </div>
  );

};

export default Search;
