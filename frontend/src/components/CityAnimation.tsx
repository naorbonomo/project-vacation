// components/CityAnimation.tsx
import React, { useState, useEffect } from 'react';
import './CityAnimation.css'; // Import CSS for animation

const cities = ["Tokyo", "Paris", "London", "Berlin", "Sydney", "Moscow", "Beijing", "Cairo"];

const CityAnimation: React.FC = () => {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    if (currentCityIndex < cities.length) {
      const timer = setTimeout(() => {
        setCurrentCityIndex((prevIndex) => prevIndex + 1);
      }, 1500); // Show each city for 2 seconds

      return () => clearTimeout(timer);
    } else {
      setShowAnimation(false); // Hide animation after all cities have been shown
    }
  }, [currentCityIndex]);

  if (!showAnimation) return null; // Don't render if animation is done

  return (
    <div className="city-animation">
      <span key={currentCityIndex} className="city">{cities[currentCityIndex]}</span>
    </div>
  );
};

export default CityAnimation;
