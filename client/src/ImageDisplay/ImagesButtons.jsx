import React, { useState, useEffect } from 'react';
import './ImageButtons.css';

const ImageDisplay = ({ imageNumber, imageURL, setSelectedImageURL }) => {
  const [selectedImage, setSelectedImage] = useState(imageNumber);

  const handleImageChange = newImageURL => {
    setSelectedImage(imageNumber);
    setSelectedImageURL(newImageURL);
  };

  return (
    <button
      key={imageNumber}
      className="image-button"
      onClick={() => handleImageChange(imageURL)}
    >
      {imageNumber}
    </button>
  );
};

export default ImageDisplay;
