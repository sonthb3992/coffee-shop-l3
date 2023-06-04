import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './view/navbar';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import CustomizeOrderPage from './pages/page_customize_order';
import SelectionPage from './pages/page-selection';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from './reducer/store';
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
import CustomerOrderHistory from './pages/page-order-history';
import UserProfilePage from './pages/page_user_profile';
import TestimonialsPage from './pages/page-testimonials';
import BaristaPage from './pages/page-barista';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <Router>
          <Navbar />
          <Routes>
            <Route
              path="/login"
              element={<LoginPage formType={FormType.SignIn} />}
            />
            <Route
              path="/sign-up"
              element={<LoginPage formType={FormType.SignUp} />}
            />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/barista" element={<BaristaPage />} />
            <Route
              path="/testimonials"
              element={<TestimonialsPage></TestimonialsPage>}
            ></Route>
            <Route
              path="/customize-order/:optionId/:isEditing?"
              element={<CustomizeOrderPage />}
            />
            <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
            <Route
              path="/order-history"
              element={<CustomerOrderHistory />}
            ></Route>
            <Route path="/track-order" element={<CustomerTrackPage />} />
            <Route path="/all-items/:filter?" element={<SelectionPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/user-profile" element={<UserProfilePage />} />
            <Route path="/" element={<PageHome />} />
            {<Route path="*" element={<PageNotFound />} />}{' '}
          </Routes>
          {<Footer />}
        </Router>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
