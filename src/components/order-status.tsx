import React from 'react';
import { useTranslation } from 'react-i18next';
import { Order } from '../domain/order';

interface OrderStatusProps {
  order: Order;
}

const OrderStatusComponent: React.FC<OrderStatusProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <div className="is-flex is-flex-direction-column">
      {order?.status > -1 && (
        <span className="icon-text pb-2">
          <span className="icon">
            {order?.status! >= 1 ? (
              <i className="fa-solid fa-check has-text-primary"></i>
            ) : (
              <i className="fa-regular fa-circle"></i>
            )}
          </span>
          <span className={order?.status! >= 1 ? 'has-text-primary' : ''}>
            {t('Order confirmation')}
          </span>
        </span>
      )}
      {order?.status > -1 && (
        <span className="icon-text pb-2">
          <span className="icon">
            {order?.status! >= 2 ? (
              <i className="fa-solid fa-check has-text-primary"></i>
            ) : (
              <i className="fa-regular fa-circle"></i>
            )}
          </span>
          <span className={order?.status! >= 2 ? 'has-text-primary' : ''}>
            {t('Order processing')}
          </span>
        </span>
      )}
      {order?.status > -1 && (
        <span className="icon-text pb-2">
          <span className="icon">
            {order?.status! >= 3 ? (
              <i className="fa-solid fa-check has-text-primary"></i>
            ) : (
              <i className="fa-regular fa-circle"></i>
            )}
          </span>
          <span className={order?.status! >= 3 ? 'has-text-primary' : ''}>
            {t('Delivering')}
          </span>
        </span>
      )}
      {order?.status > -1 && (
        <span className="icon-text pb-2">
          <span className="icon">
            {order?.status! >= 4 ? (
              <i className="fa-solid fa-check has-text-primary"></i>
            ) : (
              <i className="fa-regular fa-circle"></i>
            )}
          </span>
          <span className={order?.status! >= 4 ? 'has-text-primary' : ''}>
            {t('Completed')}
          </span>
        </span>
      )}
      {order?.status === -1 && (
        <span className="icon-text pb-2">
          <span className="icon">
            <i className="fa-solid fa-check has-text-danger"></i>
          </span>
          <span className={order?.status! >= 4 ? 'has-text-primary' : ''}>
            {t('Cancelled')}
          </span>
        </span>
      )}
    </div>
  );
};

export default OrderStatusComponent;
