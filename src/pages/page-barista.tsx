import React, { useEffect, useState } from 'react';
import { Order } from '../domain/order';
import SingleOrderDisplay from '../view/order-item';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { useNavigate } from 'react-router-dom';
import { GetUserRole, currentRole } from '../domain/user';
import { setUserRole } from '../reducer/cartSlice';

const BaristaPage: React.FC = () => {
  const [all_orders, setAllOrders] = useState<Order[]>();
  const user = useSelector((state: RootState) => state.cart.user);
  const userRole = useSelector((state: RootState) => state.cart.userRole);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllOrder = async () => {
      var result = await Order.getAllOrders((result) => {
        setAllOrders(result);
      });
      if (result !== null) setAllOrders(result.orders);
    };
    const fetchUserRole = async () => {
      if (user && userRole == '') {
        const result = await GetUserRole(user?.uid);
        if (result === null || result !== 'barista') {
          return;
        }
        dispatch(setUserRole(result));
      }
    };

    fetchUserRole();
    fetchAllOrder();
  }, [userRole, user, currentRole]);

  return (
    <section className="section">
      {all_orders && all_orders?.length! > 0 && (
        <div className="container">
          <div className="columns is-desktop">
            <div className="column">
              <article className="message is-info">
                <div className="message-header">Unconfirmed</div>
                <div
                  className="message-body"
                  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  {all_orders!.map(
                    (o) =>
                      o.status === 0 && (
                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                      )
                  )}
                </div>
              </article>
            </div>
            <div className="column">
              <article className="message is-link">
                <div className="message-header">Confirmed</div>
                <div
                  className="message-body"
                  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  {all_orders!.map(
                    (o) =>
                      o.status === 1 && (
                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                      )
                  )}
                </div>
              </article>
            </div>
            <div className="column">
              <article className="message is-primary">
                <div className="message-header">Processing</div>
                <div
                  className="message-body"
                  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  {all_orders!.map(
                    (o) =>
                      o.status === 2 && (
                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                      )
                  )}
                </div>
              </article>
            </div>
            <div className="column">
              <article className="message is-warning">
                <div className="message-header">Delivering</div>
                <div
                  className="message-body"
                  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  {all_orders!.map(
                    (o) =>
                      o.status === 3 && (
                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                      )
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BaristaPage;
