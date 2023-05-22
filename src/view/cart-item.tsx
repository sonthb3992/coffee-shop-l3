import React from 'react';
import { MenuOption } from '../domain/menu_option';
import { Link, useNavigate } from 'react-router-dom';
import { OrderItem, getDescription } from '../domain/selected_item';
import { useDispatch } from 'react-redux';
import { deleteFromCart, setEditingItem } from '../reducer/cartSlice';

interface MenuOptionProps {
    option: OrderItem;
}

const CartPageItem: React.FC<MenuOptionProps> = ({ option }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = () => {
        if (option.id)
            dispatch(deleteFromCart(option.id));
    }

    const handleEdit = () => {
        dispatch(setEditingItem(option));
        navigate(`/customize-order/${option.menuOption?.nameEn}/true`);
    }

    return (
        <article className="media">
            <figure className="media-left   ">
                <p className="image is-64x64">
                    <img src={option.menuOption!.imageUrl}></img>
                </p>
            </figure>
            <div className="media-content">
                <div className="content">
                    <p>
                        <div className='level m-0'>
                            <div className='level-left'>
                                <strong>{option.menuOption!.nameEn}</strong> <br></br>
                            </div>
                            <div className='level-right'>
                                <strong className='has-text-primary'>${option.price?.toFixed(2)}</strong> <br></br>
                            </div>
                        </div>
                        <small>{getDescription(option)}</small>
                    </p>
                </div>
                <nav className="level is-mobile">
                    <div className="level-left">
                        <a className="level-item has-text-grey" onClick={handleEdit}>
                            <span className="icon is-small"><i className="fas fa-edit"></i></span>
                        </a>
                    </div>
                </nav>
            </div>
            <div className="media-right">
                <button className="delete" onClick={handleDelete}></button>
            </div>
        </article >
    );
};

export default CartPageItem;
