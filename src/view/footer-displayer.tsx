import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { useAppDispatch, useAppSelector } from '../reducer/hook';
import shopName from '../assets/images/shop-name.png';
import logo from '../assets/images/logo.png';
import { tab } from '@testing-library/user-event/dist/tab';
import { placeOrder } from '../reducer/cartSlice';

type Props = {}

export const FooterDisplayer = (props: Props) => {
    const [showFooter, setShowFooter] = useState<boolean>(true);
    const [showCartButton, setShowCartButton] = useState<boolean>(true);
    const [showAddButton, setShowAddButton] = useState<boolean>(true);

    const tableId = useAppSelector((state) => state.cart.table);
    const orders = useAppSelector((state) => state.cart.orderItems);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const handleGoToCart = () => {
        if (tableId && tableId != "") {
            navigate("/cart");
        }
    }
    const handleGoToAdd = () => {
        if (tableId && tableId != "") {
            navigate("/all-items");
        }
    }

    const handlePlaceOrder = async () => {
        if (orders.length > 0) {
            var success = await dispatch(placeOrder());
            console.log({ success });
            if (success !== false) {
                navigate(`/track-order/${success}`);
            }
        }
    }

    useEffect(() => {
        setShowFooter(tableId !== null && tableId !== "");
        setShowCartButton(!location.pathname.startsWith("/cart"));
        setShowAddButton(location.pathname.startsWith("/cart"));

    }, [tableId, orders, location])

    return (
        <div className="has-navbar-fixed-bottom mt-4">
            {showFooter ?
                <nav className="navbar is-fixed-bottom pt-2 pb-2 is-white has-shadow is-flex is-justify-content-center buttons">
                    {
                        showCartButton &&
                        <button className="button is-primary" onClick={handleGoToCart} disabled={!(orders.length > 0)}>
                            <span className="icon">
                                <i className="fa-solid fa-cart-shopping"></i>
                            </span>
                        </button>
                    }
                    {
                        showAddButton &&
                        <>
                            <button className="button is-primary" onClick={handleGoToAdd}>
                                <span className="icon">
                                    <i className="fa-solid fa-add"></i>
                                </span>
                            </button>
                            <button className="button is-primary" onClick={handlePlaceOrder}>
                                <span className="icon">
                                    <i className="fa-solid fa-dollar"></i>
                                </span>
                                <span>Payment</span>
                            </button>
                        </>
                    }
                </nav>
                : <>
                </>
            }
        </div >
    );
}