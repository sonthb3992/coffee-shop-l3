import React, { useEffect, useState } from 'react';
import { Order } from '../domain/order';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { setCustomerName, setPhone } from '../reducer/cartSlice';
import SingleOrderDisplayCustomerView from '../view/order-item-customer';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { auth } from '../domain/firebase';
import OrderStatusComponent from '../view/order-status';
import { or } from 'firebase/firestore';
import { OrderItem } from '../domain/selected_item';
import CartPageItem from '../view/cart-item';


const CustomerOrderHistory: React.FC = () => {

    const user = useSelector((state: RootState) => state.cart.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const language = useSelector((state: RootState) => state.cart.language);
    const { t } = useTranslation();


    const [all_orders, setAllOrders] = useState<Order[]>();
    const [order, setViewDetailOder] = useState<Order | null>();

    useEffect(() => {
        findOrders();
    }, [user]);



    const findOrders = async () => {
        if (user) {
            var result = await Order.getOrdersByCustomerUid(user.uid, (changedOrders) => {
                setAllOrders(changedOrders);
            });
            if (result !== null && result.orders.length > 0) {
                setAllOrders(result.orders);
                fetchOrderDetail(result.orders[0].id);
            }
        }
    }

    const fetchOrderDetail = async (orderId: string) => {
        var a = await Order.getOrderById(orderId, true, (orderChanged) => {
            setViewDetailOder(orderChanged);
        });
        setViewDetailOder(a?.order);
        if (a?.order?.status && a?.order?.status > 3) {
            a.unsub();
        }
    }

    return (
        <section className='section'>
            <div className='container'>
                {all_orders && all_orders.length > 0 &&
                    <div className='columns is-desktop'>
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
                        <div className='column'>
                            <article className="message is-success" >
                                <div className="message-header">
                                    {t('Order detail')}
                                </div>
                                <div className="message-body" style={{ overflowY: 'auto' }} >
                                    <p className='title is-4 mb-2'>{t('Order status')}</p>
                                    {order &&
                                        <div className='mb-2'>
                                            <OrderStatusComponent order={order}></OrderStatusComponent>
                                        </div>
                                    }

                                    {order &&
                                        <div className='level mb-0'>
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
                                        <div className="field is-grouped">
                                            <p className="control">
                                                <button className={`button ${order.status > 1 || order.status < 0 ? 'is-static' : 'is-danger'}`} onClick={() => Order.cancelOrder(order)}>
                                                    {t('Cancel order')}
                                                </button>
                                            </p>
                                            <p className='control'>
                                                <button className={`button ${order.status > 1 || order.status < 0 ? 'is-static' : 'is-danger'}`} onClick={() => Order.cancelOrder(order)}>
                                                    {t('Add to current order')}
                                                </button>
                                            </p>
                                        </div>
                                    }

                                    <hr></hr>

                                    <p className='title is-4 mt-5'>{t('Selected Items')}</p>
                                    {order && order!.items.map((item: OrderItem) => (
                                        <React.Fragment key={item.id}>
                                            <CartPageItem canEditQuantity={false} canDelete={false} option={item}></CartPageItem>
                                        </React.Fragment>
                                    ))}

                                </div>
                            </article>
                        </div>
                    </div>
                }
            </div>
        </section >
    );
};

export default CustomerOrderHistory;

