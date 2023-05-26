import React from 'react';
import { MenuOption } from '../domain/menu_option';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { useTranslation } from 'react-i18next';

interface MenuOptionProps {
    option: MenuOption;
}

const MenuOptionComponent: React.FC<MenuOptionProps> = ({ option }) => {

    const language = useSelector((state: RootState) => state.cart.language);
    const { t } = useTranslation();

    return (
        <Link to={`/customize-order/${option.nameEn}`} className='no-decoration-link menu-title'>
            <div className='box p-0'>
                <figure className="image is-square block">
                    <img src={option.imageUrl} width="270"></img>
                </figure>
            </div>
            <p className='is-size-5-tablet is-size-6 has-text-weight-semibold'>{language === "en" ? option.nameEn : option.nameVi}</p>
            <p className='is-size-6'>{t('BasePrice')}: ${option.getBasePrice()}</p>
        </Link>
    );
};

export default MenuOptionComponent;
