import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MenuOption } from './domain/menu_option';
import Navbar from './view/navbar';
import Slider from './view/slider';
import Menu from './view/menu';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CustomizeOrderPage from './pages/page_customize_order';
import SelectionPage from './pages/page-selection';
import { Provider } from 'react-redux';
import { store } from './reducer/store';
import CartPage from './pages/page-cart';
import TrackOrderPage from './pages/page-track-order';
import StaffPage from './pages/page-staff';
import CustomerTrackPage from './pages/page-customer_track';
import Footer from './view/footer';
import i18n from './locale/i18n';
import { I18nextProvider } from 'react-i18next';
import PageHome from './pages/page-home';
import LoginPage, { FormType } from './pages/page-login';
import PageNotFound from './pages/page-not-found';

const App: React.FC = () => {

  const shouldDisplayNavbar = (): boolean => {
    var result = !window.location.pathname.startsWith('/login');
    result &&= !window.location.pathname.startsWith('/sign-up');
    return result;
  };


  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <Router>
          {/* {shouldDisplayNavbar() && <Navbar />} */}
          <Navbar></Navbar>
          <Routes>
            <Route path="/login" element={<LoginPage formType={FormType.SignIn} />} />
            <Route path="/sign-up" element={<LoginPage formType={FormType.SignUp} />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/customize-order/:optionId/:isEditing?" element={<CustomizeOrderPage />} />
            <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
            <Route path="/track-order" element={<CustomerTrackPage />} />
            <Route path="/all-items/:filter?" element={<SelectionPage />} />
            <Route path="/cart/" element={<CartPage />} />
            <Route path="/" element={<PageHome />} />
            {shouldDisplayNavbar() && <Route path="*" element={<PageNotFound />} />} {/* Optional: Render a "PageNotFound" component for undefined routes */}
          </Routes>
          {/* {shouldDisplayNavbar() && <Footer />} */}
        </Router>
      </I18nextProvider>
    </Provider>
  );
}

export default App;
