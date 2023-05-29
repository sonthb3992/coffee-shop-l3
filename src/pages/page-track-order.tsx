import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrderItem } from '../domain/selected_item';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { Order } from '../domain/order';
import CartPageItem from '../view/cart-item';
import { useTranslation } from 'react-i18next';


const TrackOrderPage: React.FC = () => {
    const { orderId } = useParams();

    const language = useSelector((state: RootState) => state.cart.language);
    const { t } = useTranslation();

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


    const cancelOrder = async () => {
        if (!order) return;
        await Order.cancelOrder(order);
    }

    return (
        <section className='section'>
            <div className='container'>
                <div className='columns is-desktop'>
                    <div className='column is-half p-3'>
                        <p className='title is-4 pt-5'>{t('Delivery')}</p>
                        <div className="field">
                            <label className="label">{t("ReceiverName")}</label>
                            <div className="control has-icons-left has-icons-right">
                                <input readOnly className={`input is-static ${order?.receiver ? 'is-success' : 'is-danger'}`}
                                    type="text" value={order?.receiver}></input>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">{t('Phone number')}</label>
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
                            <label className="label">{t('Address')}</label>
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

                        <p className='title is-4 pt-5'>{t('Order status')}</p>

                        <div className='is-flex is-flex-direction-column'>
                            <span className="icon-text pb-2">
                                <span className="icon">
                                    {order?.status! >= 1
                                        ? <i className="fa-solid fa-check has-text-primary"></i>
                                        : <i className="fa-regular fa-circle"></i>}
                                </span>
                                <span className={order?.status! >= 1 ? 'has-text-primary' : ''}>{t('Order confirmation')}</span>
                            </span>
                            <span className="icon-text pb-2">
                                <span className="icon">
                                    {order?.status! >= 2
                                        ? <i className="fa-solid fa-check has-text-primary"></i>
                                        : <i className="fa-regular fa-circle"></i>}
                                </span>
                                <span className={order?.status! >= 2 ? 'has-text-primary' : ''}>{t('Order processing')}</span>
                            </span>
                            <span className="icon-text pb-2">
                                <span className="icon">
                                    {order?.status! >= 3
                                        ? <i className="fa-solid fa-check has-text-primary"></i>
                                        : <i className="fa-regular fa-circle"></i>}
                                </span>
                                <span className={order?.status! >= 3 ? 'has-text-primary' : ''}>{t('Delivering')}</span>
                            </span>
                            <span className="icon-text pb-2">
                                <span className="icon">
                                    {order?.status! >= 4
                                        ? <i className="fa-solid fa-check has-text-primary"></i>
                                        : <i className="fa-regular fa-circle"></i>}
                                </span>
                                <span className={order?.status! >= 4 ? 'has-text-primary' : ''}>{t('Completed')}</span>
                            </span>
                            {order?.status == -1 &&
                                <span className="icon-text pb-2">
                                    <span className="icon">
                                        <i className="fa-solid fa-check has-text-danger"></i>
                                    </span>
                                    <span className={order?.status! >= 4 ? 'has-text-primary' : ''}>{t('Cancelled')}</span>
                                </span>
                            }
                        </div>
                    </div>

                    <div className='column is-half p-3'>
                        <div className='card p-5' >
                            <div className='level'>
                                <div className="level-left">
                                    <p className='title is-4'>{t('Selected Items')}</p>
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
                                        <p className='title is-4'>{t('Total')}</p>
                                    </div>
                                    <div className="level-right">
                                        <p className='title is-4 has-text-primary'>${Order.calculateTotal(order!.items).toFixed(2)}</p>
                                    </div>
                                </div>
                            }
                            {order &&
                                <div className='level mb-0'>
                                    <div className="level-left">
                                        <p className='has-size-6'>{t('Subtotal')}</p>
                                    </div>
                                    <div className="level-right">
                                        <strong className='has-text-primary'>${Order.calculateSubTotal(order!.items).toFixed(2)}</strong>
                                    </div>
                                </div>
                            }
                            {order &&
                                <div className='level'>
                                    <div className="level-left">
                                        <p className='has-size-6'>{t('Tax')} (7.25%)</p>
                                    </div>
                                    <div className="level-right">
                                        <strong className='has-text-primary'>${Order.calculateTax(Order.calculateSubTotal(order!.items)).toFixed(2)}</strong>
                                    </div>
                                </div>
                            }

                            {order &&
                                <button className={`button is-fullwidth ${order.status > 1 || order.status < 0 ? 'is-static' : 'is-danger'}`} onClick={() => cancelOrder()}>
                                    {t('Cancel order')}
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default TrackOrderPage;

