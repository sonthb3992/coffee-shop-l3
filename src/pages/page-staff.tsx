import React, { useEffect, useState } from 'react';
import { Order } from '../domain/order';
import SingleOrderDisplay from '../view/order-item';


const StaffPage: React.FC = () => {
    const [all_orders, setAllOrders] = useState<Order[]>();

    useEffect(() => {
        const fetchAllOrder = async () => {
            var result = await Order.getAllOrders((result) => {
                setAllOrders(result);
            });
            if (result !== null)
                setAllOrders(result.orders)
        }
        fetchAllOrder();
    }, []);


    function cancelOrder(): void {
    }

    return (
        <section className='section'>
            {(all_orders && all_orders?.length! > 0) &&
                <div className='container'>
                    <div className='columns is-desktop'>
                        <div className='column'>
                            <article className="message is-info" >
                                <div className="message-header">
                                    Unconfirmed
                                </div>
                                <div className="message-body" style={{ maxHeight: '500px', overflowY: 'auto' }} >
                                    {all_orders!.map((o) =>
                                        o.status == 0 &&
                                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                                    )}
                                </div>
                            </article>
                        </div>
                        <div className='column'>
                            <article className="message is-link" >
                                <div className="message-header">
                                    Confirmed
                                </div>
                                <div className="message-body" style={{ maxHeight: '500px', overflowY: 'auto' }} >
                                    {all_orders!.map((o) =>
                                        o.status == 1 &&
                                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                                    )}
                                </div>
                            </article>
                        </div>
                        <div className='column'>
                            <article className="message is-primary" >
                                <div className="message-header">
                                    Processing
                                </div>
                                <div className="message-body" style={{ maxHeight: '500px', overflowY: 'auto' }} >
                                    {all_orders!.map((o) =>
                                        o.status == 2 &&
                                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                                    )}
                                </div>
                            </article>
                        </div>
                        <div className='column'>
                            <article className="message is-warning" >
                                <div className="message-header">
                                    Delivering
                                </div>
                                <div className="message-body" style={{ maxHeight: '500px', overflowY: 'auto' }} >
                                    {all_orders!.map((o) =>
                                        o.status == 3 &&
                                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                                    )}
                                </div>
                            </article>
                        </div>
                    </div>
                </div>}
        </section >
    );
};

export default StaffPage;

