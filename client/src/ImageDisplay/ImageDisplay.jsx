import React, { useState } from 'react';
import './ImageDisplay.css';

const ImageDisplay = () => {
  const [selectedImage, setSelectedImage] = useState(1);

  const handleImageChange = (imageNumber) => {
    setSelectedImage(imageNumber);
  };

  return (
    <div className="image-container">
      <div className="image-wrapper">
        {selectedImage === 1 && (
          <img
            src="https://images.freeimages.com/images/previews/ac9/railway-hdr-1361893.jpg"
            alt="example 1"
            className="image"
          />
        )}
        {selectedImage === 2 && (
          <img
            src="https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg"
            alt="example 2"
            className="image"
          />
        )}
        {selectedImage === 3 && (
          <img
            src="https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg"
            alt="example 3"
            className="image"
          />
        )}
      </div>
      <div className="buttons">
        <button
          className={`image-button ${selectedImage === 1 ? 'selected' : ''}`}
          onClick={() => handleImageChange(1)}
        >
          1
        </button>
        <button
          className={`image-button ${selectedImage === 2 ? 'selected' : ''}`}
          onClick={() => handleImageChange(2)}
        >
          2
        </button>
        <button
          className={`image-button ${selectedImage === 3 ? 'selected' : ''}`}
          onClick={() => handleImageChange(3)}
        >
          3
        </button>
      </div>
    </div>
  );
};

export default ImageDisplay;
