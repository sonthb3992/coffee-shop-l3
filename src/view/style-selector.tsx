import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../reducer/hook';
import { setSelectedStyle } from '../reducer/new-order-slice';

const StyleSelector: React.FC = () => {
  const language = useAppSelector((state) => state.cart.language);
  const styles = useAppSelector((state) => state.newItem.availableStyles);
  const selectedStyle = useAppSelector((state) => state.newItem.selectedStyle);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {}, [styles, selectedStyle]);

  return (
    <div className="block">
      <p className="is-size-5 has-text-weight-semibold pb-3">
        {t('Select_style')}
      </p>
      <div className="field is-grouped">
        {styles?.map((e) => (
          <p className="control" key={e.nameEn}>
            <button
              className={`button ${
                e.nameEn === selectedStyle?.nameEn ? 'is-primary' : ''
              }`}
              onClick={() => dispatch(setSelectedStyle(e))}
            >
              {language === 'en' ? e.nameEn : e.nameVi}
            </button>
          </p>
        ))}
      </div>
      {!selectedStyle && (
        <p className="small has-text-weight-normal has-text-danger	">
          {t('Please select a style')}
        </p>
      )}
    </div>
  );
};

export default StyleSelector;
