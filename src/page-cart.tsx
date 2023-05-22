import React, { useEffect, useState } from 'react';
import AddressModal from './view/modals/address-modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './reducer/store';
import MenuOptionComponent from './view/menu-item';
import CartPageItem from './view/cart-item';
import { OrderItem } from './domain/selected_item';
import { setAddress } from './reducer/cartSlice';


const CartPage: React.FC = () => {

    const address = useSelector((state: RootState) => state.cart.address);
    const orders = useSelector((state: RootState) => state.cart.orderItems);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddressChange = (newAddress: string) => {
        dispatch(setAddress(newAddress));
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    useEffect(() => {
    }, []);

    return (
        <section className='section'>
            <div className='container'>
                <div className='columns is-desktop'>
                    <div className='column is-half p-3'>
                        <p className='title is-4 pt-5'>Delivery</p>
                        <article className="media">
                            <figure className="media-left">
                                <p className="image is-64x64">
                                    <img src="https://minio.thecoffeehouse.com/images/tch-web-order/Delivery2.png"></img>
                                </p>
                            </figure>
                            <div className="media-content">
                                <div className="content">
                                    <p>{address}</p>
                                    {isModalOpen &&
                                        <AddressModal
                                            initialAddress={address}
                                            updateAddress={handleAddressChange}
                                            closeModal={handleCloseModal}
                                        />
                                    }
                                </div>
                                <nav className="level is-mobile">
                                    <div className="level-left">
                                        <a className="level-item" onClick={() => setIsModalOpen(true)}>
                                            <span className="icon is-small"><i className="fas fa-retweet"></i></span>
                                        </a>
                                    </div>
                                </nav>
                            </div>
                        </article>
                    </div>

                    <div className='column is-half p-3'>
                        <div className='card p-5' >
                            <div className='level'>
                                <div className="level-left">
                                    <p className='title is-4'>Selected Items</p>
                                </div>
                                <div className='level-right'>
                                    <a href="/all-items/" className='button is-primary'>Add</a>
                                </div>
                            </div>
                            <div className='p-3' style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                {orders.map((option: OrderItem) => (
                                    <React.Fragment key={option.id}>
                                        <CartPageItem option={option} ></CartPageItem>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default CartPage;
