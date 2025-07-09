
import React, { useState, useEffect } from 'react';
import './Afterimages.css';

const Afterimages = () => {
  const [showShape, setShowShape] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowShape(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="afterimages-container">
      {showShape ? (
        <div className="shape-container">
            <div className="shape red"></div>
            <p>Stare at the center of the shape for a few seconds.</p>
        </div>
      ) : (
        <div className="blank-canvas">
            <p>What do you see?</p>
        </div>
      )}
    </div>
  );
};

export default Afterimages;
