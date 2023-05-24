import React, { useEffect, useState } from 'react';
import { Order } from './domain/order';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './reducer/store';
import { setCustomerName, setPhone } from './reducer/cartSlice';
import SingleOrderDisplayCustomerView from './view/order-item-customer';
import { useTranslation } from 'react-i18next';


const CustomerTrackPage: React.FC = () => {
    const phone = useSelector((state: RootState) => state.cart.phone);
    const customerName = useSelector((state: RootState) => state.cart.customer_name);
    const dispatch = useDispatch();

    const language = useSelector((state: RootState) => state.cart.language);
    const { t } = useTranslation();


    const [all_orders, setAllOrders] = useState<Order[]>();

    const handleCustomerNameChange = (newName: string) => {
        dispatch(setCustomerName(newName));
    };

    const handlePhoneChange = (newPhone: string) => {
        dispatch(setPhone(newPhone));
    };

    useEffect(() => {
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
                        <p className='title is-4 pt-5'>{t('Find your order')}</p>
                        <div className="field">
                            <label className="label">{t('ReceiverName')}</label>
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
                                <p className="help is-danger">{t('ReceiverName_invalid')}</p>)}
                        </div>

                        <div className="field">
                            <label className="label">{t('Phone number')}</label>
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
                            {t('Find')}
                        </button>
                    </div>


                    {all_orders && all_orders.length > 0 &&

                        <div className='column'>
                            <article className="message is-info" >
                                <div className="message-header">
                                    {t('Your orders')}
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

