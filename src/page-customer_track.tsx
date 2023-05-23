import React, { useEffect, useState } from 'react';
import { Order } from './domain/order';
import SingleOrderDisplay from './view/order-item';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './reducer/store';
import { setAddress, setCustomerName, setPhone } from './reducer/cartSlice';
import SingleOrderDisplayCustomerView from './view/order-item-customer';


const CustomerTrackPage: React.FC = () => {
    const phone = useSelector((state: RootState) => state.cart.phone);
    const customerName = useSelector((state: RootState) => state.cart.customer_name);
    const dispatch = useDispatch();

    const [all_orders, setAllOrders] = useState<Order[]>();

    const handleCustomerNameChange = (newName: string) => {
        dispatch(setCustomerName(newName));
    };

    const handlePhoneChange = (newPhone: string) => {
        dispatch(setPhone(newPhone));
    };

    useEffect(() => {
        // const fetchAllOrder = async () => {
        //     var result = await Order.getAllOrders((result) => {
        //         setAllOrders(result);
        //     });
        //     if (result !== null)
        //         setAllOrders(result.orders)
        // }

        // fetchAllOrder();
    }, []);


    const findOrder = async () => {
        if (customerName === null || customerName === undefined || customerName.trim() == '') {
            alert("Please enter your name");
            return;
        }
        if (phone === null || phone === undefined || phone.trim() == '') {
            alert("Please enter your phone number");
            return;
        }
        var result = await Order.getOrdersOfCustomer(customerName, phone, (changedOrders) => {
            setAllOrders(changedOrders);
        });
        if (result !== null)
            setAllOrders(result.orders);
    }

    return (
        <section className='section'>
            <div className='container'>
                <div className='columns is-desktop'>
                    <div className={`column ${all_orders && all_orders.length > 0 ? '' : 'is-half is-offset-one-quarter'}`}>
                        <p className='title is-4 pt-5'>Find your order</p>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control has-icons-left has-icons-right">
                                <input className={`input ${customerName ? 'is-success' : 'is-danger'}`}
                                    type="text" value={customerName}
                                    onChange={(event) => handleCustomerNameChange(event.target.value)}
                                    placeholder="enter your name"></input>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>
                            {(!customerName &&
                                <p className="help is-danger">Please enter a valid name</p>)}
                        </div>

                        <div className="field">
                            <label className="label">Phone number</label>
                            <div className="control has-icons-left has-icons-right">
                                <input className={`input ${phone ? 'is-success' : 'is-danger'}`}
                                    type="text" value={phone}
                                    onChange={(event) => handlePhoneChange(event.target.value)}
                                    placeholder="enter phone number"></input>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-phone"></i>
                                </span>
                            </div>
                        </div>
                        <button className='button is-primary' onClick={() => findOrder()}>
                            Find my order
                        </button>
                    </div>


                    {all_orders && all_orders.length > 0 &&

                        <div className='column'>
                            <article className="message is-info" >
                                <div className="message-header">
                                    Your orders
                                </div>
                                <div className="message-body" style={{ maxHeight: '500px', overflowY: 'auto' }} >
                                    {all_orders!.map((o) =>
                                        <SingleOrderDisplayCustomerView order={o}></SingleOrderDisplayCustomerView>
                                    )}
                                </div>
                            </article>
                        </div>
                    }
                </div>
            </div>
        </section >
    );
};

export default CustomerTrackPage;

