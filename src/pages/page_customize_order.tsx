import React, { useEffect, useState } from 'react';
import QuantitySelector from '../view/quanlity-selector';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../reducer/hook';
import SizeSelector from '../view/size-selector';
import StyleSelector from '../view/style-selector';
import {
  addCurrentItemToCart,
  fetchNewItemOptions,
  setQuantity,
} from '../reducer/new-order-slice';
import ToppingSelector from '../view/topping-selector';
import { async } from '@firebase/util';
import { MenuOption } from '../domain/menu_option';
import { Review } from '../domain/review';

const CustomizeOrderPage: React.FC = () => {
  const menuOption = useAppSelector((state) => state.newItem.menuItem);
  const language = useAppSelector((state) => state.cart.language);

  const hasStyles = useAppSelector((state) => state.newItem.hasStyles);
  const hasSizes = useAppSelector((state) => state.newItem.hasSizes);
  const hasTopping = useAppSelector((state) => state.newItem.hasTopping);

  const selectedStyle = useAppSelector((state) => state.newItem.selectedStyle);
  const selectedSize = useAppSelector((state) => state.newItem.selectedSize);

  const price = useAppSelector((state) => state.newItem.price);

  const [reviews, setReviews] = useState<Review[]>([]);

  const appDispath = useAppDispatch();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    appDispath(fetchNewItemOptions());

    const fetchItemReviews = async () => {
      if (!menuOption?.uid) return;
      const result = await MenuOption.getReviews(menuOption!.uid);
      setReviews(result);
    };

    fetchItemReviews();
  }, [selectedSize, selectedStyle]);

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-desktop">
          <div className="column">
            <figure className="image is-square">
              <img
                src={menuOption?.imageUrl}
                width={300}
                alt={menuOption?.nameEn}
              ></img>
            </figure>
            {reviews && reviews.map((r) => <div>{r.comment}</div>)}
          </div>
          <div className="column">
            <div className="block">
              <div className="columns">
                <div className="column is-three-fifths">
                  <p className="is-size-3 has-text-weight-semibold">
                    {language === 'en'
                      ? menuOption?.nameEn
                      : menuOption?.nameVi}
                  </p>
                  <p className="is-size-4 has-text-weight-semibold has-text-primary">
                    {t('BasePrice')}: ${price}
                  </p>
                </div>
                <div className="column is-two-fifths">
                  <div className="is-flex is-flex-direction-row is-justify-content-flex-start-mobile">
                    <QuantitySelector
                      max={99}
                      min={1}
                      onQuantityChanged={(value) =>
                        dispatch(setQuantity(value))
                      }
                    ></QuantitySelector>
                  </div>
                </div>
              </div>
            </div>

            {hasStyles && <StyleSelector />}
            {hasSizes && <SizeSelector />}
            {hasTopping && <ToppingSelector />}

            <button
              className="button is-primary is-fullwidth mt-6"
              onClick={() => dispatch(addCurrentItemToCart())}
            >
              {t('AddToCart')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizeOrderPage;
