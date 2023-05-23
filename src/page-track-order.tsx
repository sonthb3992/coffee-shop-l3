import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MenuOption } from './domain/menu_option';
import QuantitySelector from './view/quanlity-selector';
import { StyleOption } from './domain/option_stype';
import { SizeOption } from './domain/option_size';
import { OrderItem, buildOrder } from './domain/selected_item';
import { ToppingOption } from './domain/option_topping';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addToCart } from './reducer/cartSlice';
import { RootState } from './reducer/store';
import { Order } from './domain/order';
import CartPageItem from './view/cart-item';


const TrackOrderPage: React.FC = () => {
    const { orderId } = useParams();

    const [order, setOrder] = useState<Order | null>();

    useEffect(() => {
        const fetchMenuOptions = async () => {
            var a = await Order.getOrderById(orderId, true, (value) => {
                setOrder(value);
            });
            setOrder(a?.order);
            if (a?.order?.status && a?.order?.status > 3) {
                a.unsub();
            }
        };

        fetchMenuOptions()
    }, []);


    function cancelOrder(): void {
        console.log(order);
    }

    return (
        <section className='section'>
            <div className='container'>
                <div className='columns is-desktop'>
                    <div className='column is-half p-3'>
                        <p className='title is-4 pt-5'>Delivery</p>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control has-icons-left has-icons-right">
                                <input readOnly className={`input is-static ${order?.receiver ? 'is-success' : 'is-danger'}`}
                                    type="text" value={order?.receiver}></input>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Phone number</label>
                            <div className="control has-icons-left has-icons-right">
                                <input readOnly className={`input is-static ${order?.phoneNumber ? 'is-success' : 'is-danger'}`}
                                    type="text" value={order?.phoneNumber}
                                    placeholder="enter phone number"></input>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-phone"></i>
                                </span>
                            </div>
                            {/* {(!phone &&
                                <p className="help is-danger">Please enter a valid phone number. Our staff may call you to confirm the order.</p>)} */}
                        </div>

                        <div className="field">
                            <label className="label">Address</label>
                            <div className="control has-icons-left has-icons-right">
                                <input readOnly className={`input is-static ${order?.address ? 'is-success' : 'is-danger'}`}
                                    type="email" value={order?.address} placeholder="enter delivery address"></input>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-map"></i>
                                </span>
                            </div>
                            {/* {(!address &&
                                <p className="help is-danger">Please enter a valid delivery address</p>)} */}
                        </div>

                        <p className='title is-4 pt-5'>Order status</p>
                        <div className='is-flex is-flex-direction-column'>
                            <span className="icon-text pb-2">
                                <span className="icon">
                                    {order?.status! >= 1
                                        ? <i className="fa-solid fa-check has-text-primary"></i>
                                        : <i className="fa-regular fa-circle"></i>}
                                </span>
                                <span className={order?.status! >= 1 ? 'has-text-primary' : ''}>Order confirmation</span>
                            </span>
                            <span className="icon-text pb-2">
                                <span className="icon">
                                    {order?.status! >= 2
                                        ? <i className="fa-solid fa-check has-text-primary"></i>
                                        : <i className="fa-regular fa-circle"></i>}
                                </span>
                                <span className={order?.status! >= 2 ? 'has-text-primary' : ''}>Order processing</span>
                            </span>
                            <span className="icon-text pb-2">
                                <span className="icon">
                                    {order?.status! >= 3
                                        ? <i className="fa-solid fa-check has-text-primary"></i>
                                        : <i className="fa-regular fa-circle"></i>}
                                </span>
                                <span className={order?.status! >= 3 ? 'has-text-primary' : ''}>Delivering</span>
                            </span>
                            <span className="icon-text pb-2">
                                <span className="icon">
                                    {order?.status! >= 4
                                        ? <i className="fa-solid fa-check has-text-primary"></i>
                                        : <i className="fa-regular fa-circle"></i>}
                                </span>
                                <span className={order?.status! >= 4 ? 'has-text-primary' : ''}>Completed</span>
                            </span>
                        </div>
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
                                {order && order!.items.map((item: OrderItem) => (
                                    <React.Fragment key={item.id}>
                                        <CartPageItem canEditQuantity={false} canDelete={false} option={item}></CartPageItem>
                                    </React.Fragment>
                                ))}
                            </div>
                            {order &&
                                <div className='level'>
                                    <div className="level-left">
                                        <p className='title is-4'>Total</p>
                                    </div>
                                    <div className="level-right">
                                        <p className='title is-4 has-text-primary'>${Order.calculateTotal(order!.items).toFixed(2)}</p>
                                    </div>
                                </div>
                            }
                            {order &&
                                <div className='level mb-0'>
                                    <div className="level-left">
                                        <p className='has-size-6'>Subtotal</p>
                                    </div>
                                    <div className="level-right">
                                        <strong className='has-text-primary'>${Order.calculateSubTotal(order!.items).toFixed(2)}</strong>
                                    </div>
                                </div>
                            }
                            {order &&
                                <div className='level'>
                                    <div className="level-left">
                                        <p className='has-size-6'>Tax (7.25%)</p>
                                    </div>
                                    <div className="level-right">
                                        <strong className='has-text-primary'>${Order.calculateTax(Order.calculateSubTotal(order!.items)).toFixed(2)}</strong>
                                    </div>
                                </div>
                            }

                            <button className="button is-fullwidth is-danger" onClick={() => cancelOrder()}>
                                Cancel order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default TrackOrderPage;

