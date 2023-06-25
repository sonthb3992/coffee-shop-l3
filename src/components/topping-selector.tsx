import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../reducer/hook';
import { toggleTopping } from '../reducer/new-order-slice';

const StyleSelector: React.FC = () => {
  const language = useAppSelector((state) => state.cart.language);
  const acceptableToppings = useAppSelector(
    (state) => state.newItem.availableToppings
  );
  const selectedToppings = useAppSelector(
    (state) => state.newItem.selectedToppings
  );

  const selectedStyle = useAppSelector((state) => state.newItem.selectedStyle);
  const dispatch = useAppDispatch();

  useEffect(() => {}, [acceptableToppings, selectedStyle]);

  return (
    <div className="block">
      <p className="is-size-5 has-text-weight-semibold pb-3">Toppings</p>
      <div className="field is-grouped is-grouped-multiline">
        {acceptableToppings &&
          acceptableToppings?.map((e) => (
            <p className="control" key={e.nameEn}>
              <button
                className={`button ${
                  selectedToppings.find((t) => t.nameEn === e.nameEn) !==
                  undefined
                    ? 'is-primary'
                    : ''
                }`}
                onClick={() => dispatch(toggleTopping(e))}
              >
                {language === 'en' ? e.nameEn : e.nameVi}
              </button>
            </p>
          ))}
      </div>
    </div>
  );
};

export default StyleSelector;
