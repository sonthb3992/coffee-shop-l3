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
import ReviewItem from '../view/review-item';
import { GetReviewsOfOrder, Review } from '../domain/review';

const BaristaOrderHistory: React.FC = () => {
  const user = useSelector((state: RootState) => state.cart.user);
  const userData = useSelector((state: RootState) => state.user.userData);

  const { t } = useTranslation();

  const [all_orders, setAllOrders] = useState<Order[]>();
  const [order, setViewDetailOder] = useState<Order | null>();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    findOrders();
  }, [user, userData]);

  const findOrders = async () => {
    if (user) {
      var result = await Order.getOrdersByBaristaUid(
        user.uid,
        (changedOrders) => {
          setAllOrders(changedOrders);
        }
      );
      if (result !== null && result.orders.length > 0) {
        setAllOrders(result.orders);
        await handleViewDetail(result.orders[0].id);
      }
    }
  };

  const handleViewDetail = async (orderId: string) => {
    await fetchOrderDetail(orderId);
    await fetchReviews(orderId);
  };

  const fetchReviews = async (orderUid: string) => {
    const result = await GetReviewsOfOrder(orderUid);
    setReviews(result);
  };

  const fetchOrderDetail = async (orderId: string) => {
    var a = await Order.getOrderById(orderId, true, (orderChanged) => {
      setViewDetailOder(orderChanged);
    });
    setViewDetailOder(a?.order);
    if (a?.order?.status && a?.order?.status > 3) {
      a.unsub();
    }
  };

  return (
    <section className="section">
      <div className="container">
        {all_orders && all_orders.length > 0 && (
          <div className="columns is-desktop">
            <div className="column">
              <article className="message is-info">
                <div className="message-header">{t('Your orders')}</div>
                <div
                  className="message-body"
                  style={{ overflowY: 'auto', maxHeight: 665 }}
                >
                  {all_orders!.map((o) => (
                    <SingleOrderDisplayCustomerView
                      order={o}
                      onViewDetail={(id) => handleViewDetail(id)}
                    ></SingleOrderDisplayCustomerView>
                  ))}
                </div>
              </article>
            </div>
            <div className="column">
              <article className="message is-success">
                <div className="message-header">{t('Order detail')}</div>
                <div className="message-body" style={{ overflowY: 'auto' }}>
                  <p className="title is-4 mb-2">{t('Order status')}</p>
                  {order && (
                    <div className="mb-2">
                      <OrderStatusComponent
                        order={order}
                      ></OrderStatusComponent>
                    </div>
                  )}

                  {order && (
                    <div className="level mb-1">
                      <div className="level-left">
                        <p className="title is-4">{t('Total')}</p>
                      </div>
                      <div className="level-right">
                        <p className="title is-4 has-text-primary">
                          ${Order.calculateTotal(order!.items).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                  {order && (
                    <div className="level mb-1">
                      <div className="level-left">
                        <p className="has-size-6">{t('Subtotal')}</p>
                      </div>
                      <div className="level-right">
                        <strong className="has-text-primary">
                          ${Order.calculateSubTotal(order!.items).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  )}
                  {order && (
                    <div className="level mb-1">
                      <div className="level-left">
                        <p className="has-size-6">{t('Tax')} (7.25%)</p>
                      </div>
                      <div className="level-right">
                        <strong className="has-text-primary">
                          $
                          {Order.calculateTax(
                            Order.calculateSubTotal(order!.items)
                          ).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  )}
                  {order && order.status === 4 && order.isReviewed && (
                    <div>
                      <p className="title is-4 mt-5">{t('Reviews')}</p>
                      {reviews.map((option) => (
                        <ReviewItem review={option} />
                      ))}
                    </div>
                  )}
                  <p className="title is-4 mt-5">{t('Selected Items')}</p>
                  {order &&
                    order!.items.map((item: OrderItem) => (
                      <React.Fragment key={item.id}>
                        <CartPageItem
                          canEditQuantity={false}
                          canReview={order.status === 4 ? true : false}
                          canDelete={false}
                          option={item}
                        ></CartPageItem>
                      </React.Fragment>
                    ))}
                </div>
              </article>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BaristaOrderHistory;
