import React from 'react';
import Slider from '../view/slider';
import Menu from '../view/menu';

const PageHome: React.FC = () => {
  return (
    <div>
      <Slider />
      <section className="section p-4">
        <Menu chunkSize={4} typeFilter="" />
      </section>
    </div>
  );
};

export default PageHome;
