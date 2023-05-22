import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import shopName from '../assets/images/shop-name.png'; // change this to the path of your image
import logo from '../assets/images/logo.png'; // change this to the path of your image
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { cartSlice } from '../reducer/cartSlice';


interface ILng {
    code: string;
    native: string;
}

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const orderCount = useSelector((state: RootState) => state.cart.orderItems.length || 0);
    const lngs: ILng[] = [
        { code: "en", native: "En" },
        { code: "vn", native: "Vi" },
    ];

    const { t, i18n } = useTranslation();

    const handleTrans = (code: string) => {
        i18n.changeLanguage(code);
    };

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <img src={logo} alt='Logo'></img>
                    <img src={shopName} alt="Logo" width="112" height="28" />
                </a>

                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-end">
                    <a className="navbar-item has-text-weight-semibold">
                        {t("Home")}
                    </a>

                    <a className="navbar-item has-text-weight-semibold">
                        {t("Drinks")}
                    </a>

                    <a className="navbar-item has-text-weight-semibold">
                        {t("Foods & Snacks")}
                    </a>

                    <div className="navbar-item">
                        <div className="buttons">
                            <a className="button is-primary" href="/cart">
                                <span className="icon">
                                    <i className="fa-solid fa-cart-shopping"></i>
                                </span>
                                <span>Go to cart ({orderCount ?? 0})</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
