import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import shopName from '../assets/images/shop-name.png'; // change this to the path of your image
import logo from '../assets/images/logo.png'; // change this to the path of your image
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../domain/firebase';
import { setUser } from '../reducer/cartSlice';
import UserInfoComponent from './user-info-component';
import { useLocation } from 'react-router-dom';
import { currentRole } from '../domain/user';

const Navbar: React.FC = () => {
  const orderCount = useSelector(
    (state: RootState) => state.cart.orderItems.length || 0
  );
  const user = useSelector((state: RootState) => state.cart.user);
  const userRole = useSelector((state: RootState) => state.cart.userRole);

  const [showMenuOnMobile, setShowMenuOnMobile] = useState<boolean>(false);
  const [showNavbar, setShownNavbar] = useState<boolean>(false);
  const location = useLocation();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const shouldDisplayNavbar = (): boolean => {
    var result = !location.pathname.startsWith('/login');
    result &&= !location.pathname.startsWith('/sign-up');
    return result;
  };

  useEffect(() => {
    const user = auth.currentUser;
    console.log(user);
    dispatch(setUser(user));
    setShownNavbar(shouldDisplayNavbar());

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, location, userRole]);

  const toggleMenu = () => {
    setShowMenuOnMobile(!showMenuOnMobile);
  };

  return showNavbar === false ? (
    <div></div>
  ) : (
    <nav
      className="navbar is-spaced is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src={logo} alt="Logo"></img>
          <img src={shopName} alt="Logo" width="112" height="28" />
        </a>

        <button
          className={`navbar-burger ${showMenuOnMobile ? 'is-active' : ''}`}
          onClick={() => toggleMenu()}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div
        id="navbarBasicExample"
        className={`navbar-menu ${showMenuOnMobile ? 'is-active' : ''}`}
      >
        <div className="navbar-start">
          <a className="navbar-item has-text-weight-semibold" href="/">
            {t('Home')}
          </a>
          <a
            className="navbar-item has-text-weight-semibold"
            href="/all-items/drink"
          >
            {t('Drinks')}
          </a>
          <a
            className="navbar-item has-text-weight-semibold"
            href="/all-items/breakfast"
          >
            {t('Breakfast')}
          </a>
          <a
            className="navbar-item has-text-weight-semibold"
            href="/order-history"
          >
            {t('My orders')}
          </a>
          {'barista' && (
            <a className="navbar-item has-text-weight-semibold" href="/barista">
              {t('Barista')}
            </a>
          )}
          <a
            className="navbar-item has-text-weight-semibold"
            href="/testimonials"
          >
            {t('Testimonials')}
          </a>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-primary" href={user ? '/cart' : '/login'}>
                <span className="icon">
                  <i className="fa-solid fa-cart-shopping"></i>
                </span>
                <span>{t('GoToCart', { count: orderCount ?? 0 })}</span>
              </a>
            </div>
          </div>
          {user && <UserInfoComponent user={user}></UserInfoComponent>}
          {!user && (
            <div className="buttons">
              <a href="/login" className="button is-success is-inverted">
                Login
              </a>
              <a href="/sign-up" className="button is-info is-inverted">
                Sign up
              </a>
            </div>
          )}
          {/* </a> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
