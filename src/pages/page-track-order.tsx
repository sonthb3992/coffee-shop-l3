import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrderItem } from '../domain/selected_item';
import { Order } from '../domain/order';
import CartPageItem from '../view/cart-item';
import { useTranslation } from 'react-i18next';
import OrderStatusComponent from '../view/order-status';
import ReviewForm from '../view/review-form';
import { useAppSelector } from '../reducer/hook';
import { tab } from '@testing-library/user-event/dist/tab';

const TrackOrderPage: React.FC = () => {
  const { orderId } = useParams();

  const { t } = useTranslation();
  const table = useAppSelector((state) => state.cart.table);

  const [order, setOrder] = useState<Order | null>();

  const isOrderAtTable = (): boolean => {
    return table !== null && table !== '';
  }


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

    fetchMenuOptions();
  }, [orderId]);

  return (
    <section className="section pt-3">
      <div className="container">
        <div className="columns is-desktop">
          <div className="column is-half p-3 cart-item-border">
            {
              (!isOrderAtTable()) &&
              <>
                <p className="title is-4 pt-5">{t('Delivery')}</p>
                <div className="field">
                  <label className="label">{t('ReceiverName')}</label>
                  <div className="control has-icons-left has-icons-right">
                    <input
                      readOnly
                      className={`input is-static ${order?.receiver ? 'is-success' : 'is-danger'
                        }`}
                      type="text"
                      value={order?.receiver}
                    ></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                </div>

                <div className="field">
                  <label className="label">{t('Phone number')}</label>
                  <div className="control has-icons-left has-icons-right">
                    <input
                      readOnly
                      className={`input is-static ${order?.phoneNumber ? 'is-success' : 'is-danger'
                        }`}
                      type="text"
                      value={order?.phoneNumber}
                      placeholder="enter phone number"
                    ></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-phone"></i>
                    </span>
                  </div>
                </div>

                <div className="field">
                  <label className="label">{t('Address')}</label>
                  <div className="control has-icons-left has-icons-right">
                    <input
                      readOnly
                      className={`input is-static ${order?.address ? 'is-success' : 'is-danger'
                        }`}
                      type="email"
                      value={order?.address}
                      placeholder="enter delivery address"
                    ></input>
                    <span className="icon is-small is-left">
                      <i className="fas fa-map"></i>
                    </span>
                  </div>
                  {/* {(!address &&                           <p className="help is-danger">Please enter a valid delivery address</p>)} */}
                </div>
              </>
            }
            <p className={`title is-4 ${isOrderAtTable() ? "" : "pt-5"}`}>{t('Order status')}</p>
            {order && (
              <OrderStatusComponent order={order}></OrderStatusComponent>
            )}
          </div>
          <div className="column is-half p-3">
            <div className={(table !== null && table !== '') ? "" : "card p-5"}>
              <div className="level">
                <div className="level-left">
                  <p className="title is-4">{t('Selected Items')}</p>
                </div>
              </div>
              <div
                className="p-3"
                style={{ maxHeight: '500px', overflowY: 'auto' }}
              >
                {order &&
                  order!.items.map((item: OrderItem) => (
                    <React.Fragment key={item.id}>
                      <CartPageItem
                        canEditQuantity={false}
                        canReview={!isOrderAtTable()}
                        canDelete={false}
                        option={item}
                      ></CartPageItem>
                    </React.Fragment>
                  ))}
              </div>

              {/*               
              {order && (
                <div className="level">
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
                <div className="level mb-0">
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
                <div className="level">
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
              )} */}

              {order && (order.status === 1 || order.status === 0) && (
                !isOrderAtTable() &&
                <button
                  className="button is-fullwidth is-danger"
                  onClick={() => Order.cancelOrder(order)}
                >
                  {t('Cancel order')}
                </button>
              )}

              {order && order.status === 4 && !order.isReviewed && (
                <ReviewForm isModal={false} order={order}></ReviewForm>
              )}
              {order && order.isReviewed && (
                <p>Thank you!. You have reviewed this order.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackOrderPage;
