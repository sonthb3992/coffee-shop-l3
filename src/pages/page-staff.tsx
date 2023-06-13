import React, { useEffect, useState } from 'react';
import { Order } from '../domain/order';
import SingleOrderDisplay from '../view/order-item';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../reducer/hook';
import { auth } from '../domain/firebase';
import { fetchUserData } from '../reducer/user-slice';
import PermissionAlertComponent from '../view/permission-alert';

const StaffPage: React.FC = () => {
  const [all_orders, setAllOrders] = useState<Order[]>();
  const userData = useAppSelector((state) => state.user.userData);
  const user = auth.currentUser;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchAllOrder = async () => {
      var result = await Order.getAllOrders((result) => {
        setAllOrders(result);
      });
      if (result !== null) setAllOrders(result.orders);
    };
    dispatch(fetchUserData());
    fetchAllOrder();
  }, [userData, user]);

  return userData?.role !== 'staff' ? (
    <PermissionAlertComponent></PermissionAlertComponent>
  ) : (
    <section className="section">
      <div className="container">
        <div className="columns is-desktop">
          <div className="column">
            <article className="message is-info">
              <div className="message-header">Unconfirmed</div>
              <div
                className="message-body"
                style={{ maxHeight: '500px', overflowY: 'auto' }}
              >
                {all_orders &&
                  all_orders!.map(
                    (o) =>
                      o.status === 0 && (
                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                      )
                  )}
                {(!all_orders || all_orders.length === 0) && (
                  <div>There's no incoming orders.</div>
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
                {all_orders &&
                  all_orders!.map(
                    (o) =>
                      o.status === 1 && (
                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                      )
                  )}
                {(!all_orders || all_orders.length === 0) && (
                  <div>There's no confirmed orders.</div>
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
                {all_orders &&
                  all_orders!.map(
                    (o) =>
                      o.status === 2 && (
                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                      )
                  )}
                {(!all_orders || all_orders.length === 0) && (
                  <div>There's no processing orders.</div>
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
                {all_orders &&
                  all_orders!.map(
                    (o) =>
                      o.status === 3 && (
                        <SingleOrderDisplay order={o}></SingleOrderDisplay>
                      )
                  )}
                {(!all_orders || all_orders.length === 0) && (
                  <div>There's no delivering orders.</div>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaffPage;
