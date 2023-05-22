import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MenuOption } from './domain/menu_option';
import Navbar from './view/navbar';
import Slider from './view/slider';
import Menu from './view/menu';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomizeOrderPage from './page_customize_order';
import SelectionPage from './page-selection';
import { Provider } from 'react-redux';
import { store } from './reducer/store';
import CartPage from './page-cart';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <div className='container'>
          <Navbar></Navbar>
        </div>
        <Router>
          <Routes>
            <Route path="/customize-order/:optionId/:isEditing?" element={<CustomizeOrderPage />}>
            </Route>
            <Route path="/all-items/" element={<SelectionPage />}>
            </Route>
            <Route path="/cart/" element={<CartPage />}>
            </Route>
            <Route path="/" element={
              <>
                <Slider></Slider><section className='section'>
                  <Menu chunkSize={4} typeFilter='' />
                </section>
              </>
            }>
            </Route>
          </Routes>
        </Router >
      </div>
    </Provider>
  );
};


export default App;
