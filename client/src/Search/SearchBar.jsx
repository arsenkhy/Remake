import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import debounce from 'lodash/debounce';
import allowedMovies from './data/allowed_movies.json';
import ImageDisplay from '../ImageDisplay/ImagesButtons';
import Image from '../ImageDisplay/Image';
import './SearchBar.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [submitCount, setSubmitCount] = useState(0);
  const [selectedImageURL, setSelectedImageURL] = useState();
  const [imageDisplays, setImageDisplays] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const response = await fetch('http://localhost:5050/movies/645078ec2096d5876c9a91b5');
        const movie = await response.json();
        setImageUrls(movie.images);
      } catch (error) {
        console.error(error);
      }
    }
    fetchImageUrls();
  }, []);
  
  useEffect(() => {
    const fetchMovieTitles = async () => {
      try {
        const response = await axios.get('http://localhost:5050/search', {
          params: {
            query: searchTerm
          }
        });
        const titles = response.data.map(movie => movie.title);
        setOptions(titles);
      } catch (error) {
        console.error(error);
      }
    };
  
    // Debounce the API call
    const debouncedFetchMovieTitles = debounce(fetchMovieTitles, 200);
    debouncedFetchMovieTitles();
  
    // Cancel the previous API call when the searchTerm changes
    return () => {
      debouncedFetchMovieTitles.cancel();
    };
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
    if (imageUrls.length > 0) {
      handleFormSubmit({preventDefault: () => {}});
    }
  }, [imageUrls]);  

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
