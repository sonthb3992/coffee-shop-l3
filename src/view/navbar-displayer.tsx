import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';
import { useAppDispatch, useAppSelector } from '../reducer/hook';
import shopName from '../assets/images/shop-name.png';
import logo from '../assets/images/logo.png';

type Props = {}

export const NavbarDisplayer = (props: Props) => {
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState<boolean>(true);
    const tableId = useAppSelector((state) => state.cart.table);


    useEffect(() => {
        if (tableId && tableId !== "") {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }
    }, [location, tableId])

    return (
        showNavbar ? <Navbar></Navbar> : <>
            <nav className="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="/all-items">
                        <img src={logo} alt="Logo"></img>
                        <img src={shopName} alt="Logo" width="112" height="28" />

                    </a>
                    <div className="navbar-item is-size-5 pb-0 has-text-weight-semibold is-uppercase has-text-primary-dark	">
                        Order at table
                    </div>
                </div>
            </nav>
        </>
    )
}