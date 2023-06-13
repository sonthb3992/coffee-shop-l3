import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../reducer/hook';
import { setSelectedSize } from '../reducer/new-order-slice';

const SizeSelector: React.FC = () => {
  const language = useSelector((state: RootState) => state.cart.language);
  const sizes = useAppSelector((state) => state.newItem.availableSizes);
  const selectedStyle = useAppSelector((state) => state.newItem.selectedStyle);
  const selectedSize = useSelector(
    (state: RootState) => state.newItem.selectedSize
  );
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {}, [selectedStyle]);

  return (
    <div className="block">
      <p className="is-size-5 has-text-weight-semibold pb-3">
        {t('Select_size')}
      </p>
      <div className="field is-grouped">
        {sizes &&
          sizes.length > 0 &&
          sizes
            // ?.
            .map((e) => (
              <p className="control" key={e.nameEn}>
                <button
                  className={`button ${
                    e.nameEn === selectedSize?.nameEn ? 'is-primary' : ''
                  }`}
                  onClick={() => dispatch(setSelectedSize(e))}
                >
                  {language === 'en' ? e.nameEn : e.nameVi}
                </button>
              </p>
            ))}
      </div>
      {!selectedSize && (
        <p className="has-text-danger has-text-weight-normal">
          {t('Please select a size')}
        </p>
      )}
    </div>
  );
};

export default SizeSelector;
