import React from 'react';
import { Item } from '../models/Item';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../reducer/hook';
// import { setNewItemMenuItem } from '../reducer/new-order-slice';

interface ItemComponentProps {
  item: Item;
}

const ItemComponent: React.FC<ItemComponentProps> = ({ item }) => {
  const language = useSelector((state: RootState) => state.cart.language);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onItemClicked = () => {
    // dispatch(setNewItemMenuItem(items));
    // console.log(item);
    // navigate('/customize-order/:id ');
  };

  return (
    <div role="button" onClick={() => onItemClicked()}>
      <div className="box p-0">
        <figure className="image is-square block">
          {/* <img src={item.imageUrl} width="270" alt={item.name} /> */}
        </figure>
      </div>
      <p className="is-size-5-tablet is-size-6 has-text-centered">
        {language === 'en' ? item.name : 'vn_' + item.name}
      </p>
      <p className="is-size-5-tablet is-size-6 has-text-centered">
        {t('price')} {item.price}
      </p>
    </div>
  );
};

export default ItemComponent;
