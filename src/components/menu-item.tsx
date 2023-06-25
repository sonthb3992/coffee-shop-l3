import React from 'react';
import { MenuOption } from '../domain/menu_option';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../reducer/hook';
import { setNewItemMenuItem } from '../reducer/new-order-slice';

interface MenuOptionProps {
  option: MenuOption;
}

const MenuOptionComponent: React.FC<MenuOptionProps> = ({ option }) => {
  const language = useSelector((state: RootState) => state.cart.language);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onItemClicked = () => {
    dispatch(setNewItemMenuItem(option));
    console.log(option);
    navigate('/customize-order');
  };

  return (
    <div role="button" onClick={() => onItemClicked()}>
      <div className="box p-0">
        <figure className="image is-square block">
          <img src={option.imageUrl} width="270" alt={`${option.nameEn}`}></img>
        </figure>
      </div>
      <p className="is-size-5-tablet is-size-6 has-text-weight-semibold">
        {language === 'en' ? option.nameEn : option.nameVi}
      </p>
      <p className="is-size-6">
        {t('BasePrice')}: ${option.getBasePrice()}
      </p>
    </div>
  );
};

export default MenuOptionComponent;
