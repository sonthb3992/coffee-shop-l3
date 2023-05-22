import React from 'react';
import { MenuOption } from '../domain/menu_option';
import { Link } from 'react-router-dom';

interface MenuOptionProps {
    option: MenuOption;
}

const MenuOptionComponent: React.FC<MenuOptionProps> = ({ option }) => {
    // Render your component here. This is just a basic example.
    return (
        <Link to={`/customize-order/${option.nameEn}`} className='no-decoration-link menu-title'>
            <div className='box p-0'>
                <figure className="image is-square block">
                    <img src={option.imageUrl} width="270"></img>
                </figure>
            </div>
            <p className='is-size-5 has-text-weight-semibold'>{option.nameVi}</p>
            <p className='is-size-6'>Price: ${option.getBasePrice()}</p>
        </Link>
    );
};

export default MenuOptionComponent;
