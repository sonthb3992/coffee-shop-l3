import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import shopName from '../assets/images/shop-name.png'; // change this to the path of your image
import logo from '../assets/images/logo.png'; // change this to the path of your image
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';


const Navbar: React.FC = () => {
    const orderCount = useSelector((state: RootState) => state.cart.orderItems.length || 0);
    const [showMenuOnMobile, setShowMenuOnMobile] = useState<boolean>(false);

    const { t } = useTranslation();

    const toggleMenu = () => {
        setShowMenuOnMobile(!showMenuOnMobile);
    }

    return (
        <nav className="navbar is-spaced" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <img src={logo} alt='Logo'></img>
                    <img src={shopName} alt="Logo" width="112" height="28" />
                </a>

                <a role="button" className={`navbar-burger ${showMenuOnMobile ? 'is-active' : ''}`} onClick={() => toggleMenu()} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className={`navbar-menu ${showMenuOnMobile ? 'is-active' : ''}`}>
                <div className="navbar-end">
                    <a className="navbar-item has-text-weight-semibold" href='/'>
                        {t("Home")}
                    </a>

                    <a className="navbar-item has-text-weight-semibold" href="/all-items/drink">
                        {t("Drinks")}
                    </a>

                    <a className="navbar-item has-text-weight-semibold" href="/all-items/breakfast">
                        {t("Breakfast")}
                    </a>
                    <a className="navbar-item has-text-weight-semibold" href="/track-order">
                        {t("My orders")}
                    </a>
                    <div className="navbar-item">
                        <div className="buttons">
                            <a className="button is-primary" href="/cart">
                                <span className="icon">
                                    <i className="fa-solid fa-cart-shopping"></i>
                                </span>
                                <span>{t('GoToCart', { count: orderCount ?? 0 })}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
