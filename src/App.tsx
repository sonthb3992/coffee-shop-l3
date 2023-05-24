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
import TrackOrderPage from './page-track-order';
import StaffPage from './page-staff';
import CustomerTrackPage from './page-customer_track';
import Footer from './view/footer';
import i18n from './locale/i18n';
import { I18nextProvider } from 'react-i18next';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        {/* <div className='container'> */}
        <Navbar></Navbar>
        {/* </div> */}
        <Router>
          <Routes>
            <Route path='/staff' element={<StaffPage />}></Route>
            <Route path="/customize-order/:optionId/:isEditing?" element={<CustomizeOrderPage />}>
            </Route>
            <Route path='/track-order/:orderId' element={<TrackOrderPage />}></Route>
            <Route path='/track-order' element={<CustomerTrackPage />}></Route>
            <Route path="/all-items/:filter?" element={<SelectionPage />}>
            </Route>
            <Route path="/cart/" element={<CartPage />}>
            </Route>
            <Route path="/" element={
              <>
                <Slider></Slider>
                <section className='section'>
                  <Menu chunkSize={4} typeFilter='' />
                </section>
              </>
            }>
            </Route>
          </Routes>
        </Router >
        <Footer></Footer>
      </I18nextProvider>
    </Provider >
  );
};


export default App;
