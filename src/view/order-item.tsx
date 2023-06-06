import React from 'react';
import { Order } from '../domain/order';
import { useAppSelector } from '../reducer/hook';
import { auth } from '../domain/firebase';

interface SingleOrderDisplayProps {
  order: Order;
}

const SingleOrderDisplay: React.FC<SingleOrderDisplayProps> = ({
  order: item,
}) => {
  const userData = useAppSelector((state) => state.user.userData);

  const nextStepClick = async () => {
    await Order.sentToNextStep(item);
  };
  const nextStepClickWithBaristaUid = async () => {
    const user = auth.currentUser;
    if (user) await Order.sentToNextStep(item, user.uid);
  };

  return (
    <div className="card m-1 p-3 is-flex is-flex-direction-column is-size-7">
      <span className="icon-text has-text-small mb-1">
        <span className="icon">
          <i className="fas fa-home"></i>
        </span>
        <span>{item.address}</span>
      </span>
      <span className="icon-text mb-1">
        <span className="icon">
          <i className="fas fa-user"></i>
        </span>
        <span>{item.receiver}</span>
      </span>
      <span className="icon-text is-size-7">
        <span className="icon">
          <i className="fas fa-phone"></i>
        </span>
        <span>{item.phoneNumber}</span>
      </span>
      <div className="field is-grouped is-flex is-justify-content-flex-end">
        <p className="control">
          {item.status === 0 && userData?.role === 'staff' && (
            <button className="button is-small is-info" onClick={nextStepClick}>
              Confirm
            </button>
          )}
          {item.status === 1 && userData?.role === 'barista' && (
            <button
              className="button is-link is-small"
              onClick={nextStepClickWithBaristaUid}
            >
              Accept order
            </button>
          )}
          {item.status === 2 && (
            <button
              className="button is-primary is-small"
              onClick={nextStepClick}
            >
              Delivery
            </button>
          )}
          {item.status === 3 && (
            <button
              className="button is-warning is-small"
              onClick={nextStepClick}
            >
              Complete
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default SingleOrderDisplay;
