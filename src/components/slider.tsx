import React from 'react';
import slider from '../assets/images/7123323.jpg'; // change this to the path of your image

const Slider: React.FC = () => {
  return (
    <div className="container is-fullhd">
      <img src={slider} alt="Logo"></img>
    </div>
  );
};

export default Slider;
