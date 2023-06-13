import React, { useEffect, useState } from 'react';
import { Order } from '../domain/order';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { addItemsToCart } from '../reducer/cartSlice';
import SingleOrderDisplayCustomerView from '../view/order-item-customer';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import OrderStatusComponent from '../view/order-status';
import { OrderItem } from '../domain/selected_item';
import CartPageItem from '../view/cart-item';
import ReviewForm from '../view/review-form';
import { useAppDispatch, useAppSelector } from '../reducer/hook';
import { fetchUserData } from '../reducer/user-slice';
import { auth } from '../domain/firebase';
import { async } from 'q';

const BaristaOrderPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [openOrders, setOpenOrders] = useState<Order[]>();
  const [acceptedOpenOrders, setAcceptedOpenOrders] = useState<Order[]>();
  const [order, setViewDetailOder] = useState<Order | null>();
  const userData = useAppSelector((state) => state.user.userData);

  useEffect(() => {
    const findOrders = async () => {
      const user = auth.currentUser;
      if (user) {
        //Search for unaccepted orders
        var openOrders = await Order.getUnacceptedOrders((changedOrders) => {
          setOpenOrders(changedOrders);
        });
        if (openOrders !== null && openOrders.orders.length > 0) {
          setOpenOrders(openOrders.orders);
          fetchOrderDetail(openOrders.orders[0].id);
        }

        //Search for order accepted by this barista
        var accepted = await Order.getAcceptedOrders(
          user.uid,
          (changedOrders) => {
            setAcceptedOpenOrders(changedOrders);
          }
        );
        if (accepted !== null && accepted.orders.length > 0) {
          setAcceptedOpenOrders(accepted.orders);
          fetchOrderDetail(accepted.orders[0].id);
        }
      }
    };
    findOrders();
  }, [userData, order]);

  const handleViewDetail = (orderId: string) => {
    fetchOrderDetail(orderId);
  };

  const fetchOrderDetail = async (orderId: string) => {
    var result = await Order.getOrderById(
      orderId,
      true,
      (orderChanged: Order) => {
        setViewDetailOder(orderChanged);
        if (orderChanged.status > 3) {
          result?.unsub();
          setViewDetailOder(null);
        }
      }
    );
    setViewDetailOder(result?.order);
    if (result?.order?.status && result?.order?.status > 3) {
      result.unsub();
      setViewDetailOder(null);
    }
  };

  const handleAcceptOrder = async (order: Order) => {
    const user = auth.currentUser;
    await Order.sentToNextStep(order, user?.uid);
  };

  const handleSendToDelivery = async (order: Order) => {
    await Order.sentToNextStep(order);
    setViewDetailOder(null);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-desktop">
          {/* LEFT COLUMN */}
          <div className="column is-one-third">
            {/* OPENING ORDERS */}
            <article className="message is-info">
              <div className="message-header">{t('Opening orders')}</div>
              <div className="message-body" style={{ overflowY: 'auto' }}>
                {openOrders &&
                  openOrders.map((o) => (
                    <SingleOrderDisplayCustomerView
                      order={o}
                      onViewDetail={(id) => handleViewDetail(id)}
                    ></SingleOrderDisplayCustomerView>
                  ))}
                {!openOrders ||
                  (openOrders.length === 0 && (
                    <div>There is no opening orders</div>
                  ))}
              </div>
            </article>
            {/* ACCEPTED ORDERS */}
            <article className="message is-link">
              <div className="message-header">{t('Accepted orders')}</div>
              <div className="message-body" style={{ overflowY: 'auto' }}>
                {acceptedOpenOrders &&
                  acceptedOpenOrders!.map((o) => (
                    <SingleOrderDisplayCustomerView
                      order={o}
                      onViewDetail={(id) => handleViewDetail(id)}
                    ></SingleOrderDisplayCustomerView>
                  ))}
                {!acceptedOpenOrders ||
                  (acceptedOpenOrders.length === 0 && (
                    <div>You haven't accepted any orders</div>
                  ))}
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN */}
          <div className="column">
            <article className="message is-success">
              <div className="message-header">{t('Order detail')}</div>
              <div className="message-body" style={{ overflowY: 'auto' }}>
                {order && order.status === 1 && (
                  <div className="field is-grouped">
                    <p className="control">
                      <button
                        className="button is-success"
                        onClick={() => handleAcceptOrder(order)}
                      >
                        {t('Accept order')}
                      </button>
                    </p>
                  </div>
                )}
                {order && order.status === 2 && (
                  <div className="field is-grouped">
                    <p className="control">
                      <button
                        className="button is-success"
                        onClick={() => handleSendToDelivery(order)}
                      >
                        {t('Send to delivery')}
                      </button>
                    </p>
                  </div>
                )}

                {order &&
                  order!.items.map((item: OrderItem) => (
                    <div>
                      <p className="title is-4 mt-5">{t('Selected Items')}</p>
                      <React.Fragment key={item.id}>
                        <CartPageItem
                          canEditQuantity={false}
                          canReview={order.status === 4 ? true : false}
                          canDelete={false}
                          option={item}
                        ></CartPageItem>
                      </React.Fragment>
                    </div>
                  ))}
                {!order && (
                  <div>Please select an order to view its detail.</div>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BaristaOrderPage;
