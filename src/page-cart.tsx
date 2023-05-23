import React, { useEffect, useState } from 'react';
import AddressModal from './view/modals/address-modal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './reducer/store';
import MenuOptionComponent from './view/menu-item';
import CartPageItem from './view/cart-item';
import { OrderItem, calculatePrice } from './domain/selected_item';
import { clearCart, setAddress, setCustomerName, setPhone } from './reducer/cartSlice';
import { Order } from './domain/order';
import { or } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';


const CartPage: React.FC = () => {

    const address = useSelector((state: RootState) => state.cart.address);
    const phone = useSelector((state: RootState) => state.cart.phone);
    const customerName = useSelector((state: RootState) => state.cart.customer_name);
    const inputValid = useSelector((state: RootState) => state.cart.inputValid);
    const navigate = useNavigate();

    const items = useSelector((state: RootState) => state.cart.orderItems);
    const dispatch = useDispatch();
    const taxRate = 0.0725;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddressChange = (newAddress: string) => {
        dispatch(setAddress(newAddress));
    };

    const handlePhoneChange = (newPhone: string) => {
        dispatch(setPhone(newPhone));
    };

    const handleCustomerNameChange = (newName: string) => {
        dispatch(setCustomerName(newName));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const calculateSubTotal = (items: OrderItem[]) => {
        var total = 0;
        items.forEach((i) => total += calculatePrice(i));
        return total;
    }

    const calculateTax = (subtotal: number) => {
        return subtotal * taxRate;
    }

    const calculateTotal = (items: OrderItem[]) => {
        var total = calculateSubTotal(items);
        total += calculateTax(total);
        return total;
    }

    // if (id === '')
    //     dispatch(setId(uuidv4().toLowerCase()));

    const placeOrder = async () => {
        var order = new Order();
        order.address = address;
        order.receiver = customerName;
        order.phoneNumber = phone;
        order.items = items;
        order.status = 1;
        order.price = calculateTotal(items);
        order.id = uuidv4().toLowerCase();
        order.placeTime = new Date(Date.now());
        var s = await Order.pushToFirebase(order);
        if (s === 'success') {
            dispatch(clearCart());
            navigate(`/track-order/${order.id}`);
        }
        else {
            alert(s);
        }
    }


    useEffect(() => {

    }, []);

    return (
        <section className='section'>
            <div className='container'>
                <div className='columns is-desktop'>
                    <div className='column is-half p-3'>
                        <p className='title is-4 pt-5'>Delivery</p>
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
                            {(!phone &&
                                <p className="help is-danger">Please enter a valid phone number. Our staff may call you to confirm the order.</p>)}
                        </div>

                        <div className="field">
                            <label className="label">Address</label>
                            <div className="control has-icons-left has-icons-right">
                                <input className={`input ${address ? 'is-success' : 'is-danger'}`} type="email" value={address} onChange={(event) => handleAddressChange(event.target.value)} placeholder="enter delivery address"></input>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-map"></i>
                                </span>
                            </div>
                            {(!address &&
                                <p className="help is-danger">Please enter a valid delivery address</p>)}
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
                                {items.map((option: OrderItem) => (
                                    <React.Fragment key={option.id}>
                                        <CartPageItem option={option}></CartPageItem>
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className='level'>
                                <div className="level-left">
                                    <p className='title is-4'>Total</p>
                                </div>
                                <div className="level-right">
                                    <p className='title is-4 has-text-primary'>${calculateTotal(items).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className='level mb-0'>
                                <div className="level-left">
                                    <p className='has-size-6'>Subtotal</p>
                                </div>
                                <div className="level-right">
                                    <strong className='has-text-primary'>${calculateSubTotal(items).toFixed(2)}</strong>
                                </div>
                            </div>
                            <div className='level'>
                                <div className="level-left">
                                    <p className='has-size-6'>Tax (7.25%)</p>
                                </div>
                                <div className="level-right">
                                    <strong className='has-text-primary'>${calculateTax(calculateSubTotal(items)).toFixed(2)}</strong>
                                </div>
                            </div>

                            <button className={`button  is-fullwidth ${inputValid ? 'is-primary' : 'is-static'}`} onClick={() => placeOrder()}>
                                Place order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default CartPage;

