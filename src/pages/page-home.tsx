import React from 'react';
import Slider from '../view/slider';
import Menu from '../view/menu';

const PageHome: React.FC = () => {
    return (
        <>
            <Slider />
            <section className='section'>
                <Menu chunkSize={4} typeFilter='' />
            </section>
        </>
    );
};

export default PageHome;
