import React, { useEffect, useState } from 'react';
import { Order } from '../domain/order';
import SingleOrderDisplay from '../components/order-item';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../reducer/hook';
import { fetchUserData } from '../reducer/user-slice';
import { auth } from '../domain/firebase';
import PermissionAlertComponent from '../components/permission-alert';

const BaristaPage: React.FC = () => {
  const [all_orders, setAllOrders] = useState<Order[]>();
  const user = auth.currentUser;
  const userData = useSelector((state: RootState) => state.user.userData);
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

  return userData?.role !== 'barista' ? (
    <PermissionAlertComponent></PermissionAlertComponent>
  ) : (
    <section className="section">
      {all_orders && all_orders?.length! > 0 && (
        <div className="container">
          <div className="columns is-desktop">
            <div className="column">
              <article className="message is-link">
                <div className="message-header">Confirmed</div>
                <div
                  className="message-body"
                  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  {all_orders!
                    .filter((o) => o.status === 1)
                    .map((o) => (
                      <SingleOrderDisplay
                        key={o.id}
                        order={o}
                      ></SingleOrderDisplay>
                    ))}
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
                  {all_orders!
                    .filter((o) => o.status === 2)
                    .map((o) => (
                      <SingleOrderDisplay
                        key={o.id}
                        order={o}
                      ></SingleOrderDisplay>
                    ))}
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
