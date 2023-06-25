import React from 'react';
import Slider from '../components/slider';
import Menu from '../components/Menu';

const PageHome: React.FC = () => {
  return (
    <div>
      <Slider />
      <section className="section p-0">
        <Menu chunkSize={4} typeFilter="" />
      </section>
    </div>
  );
};

export default PageHome;
