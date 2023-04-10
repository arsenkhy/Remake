import React, { useState, useEffect } from 'react';
import SearchBar from './Search/SearchBar';
import './Search/SearchBar.css';
import ImageDisplay from './ImageDisplay/ImageDisplay';
import './App.css';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5050/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="app-container">
      <div className="header-wrapper">
        <header>
          <h1>{message}</h1>
        </header>
        <div className="image-wrapper">
          <ImageDisplay />
        </div>
        <div className="search-wrapper">
          <SearchBar />
        </div>
      </div>
    </div>
  );
  
};

export default App;
