// CustomSlider.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CustomSlider = ({ data, renderItem, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(data.length - 1);
    }
  };

  return (
    <div className={`slider-container ${className}`}>
      <div className="slider-wrapper">
        {renderItem(data[currentIndex])}
      </div>
      <button className="slider-control prev" onClick={prevSlide}>
        &#8249;
      </button>
      <button className="slider-control next" onClick={nextSlide}>
        &#8250;
      </button>
    </div>
  );
};

CustomSlider.propTypes = {
  data: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  className: PropTypes.string,
};

CustomSlider.defaultProps = {
  className: '',
};

export default CustomSlider;
