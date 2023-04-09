import React, { useState, useEffect } from 'react';
import SearchBar from './Search/SearchBar';
import './Search/SearchBar.css';
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
    <div className="search-container-wrapper">
      <header>
        <h1>{message}</h1>
      </header>
      {/* Render the SearchBar component */}
      <SearchBar />
    </div>
  );
};

export default App;
