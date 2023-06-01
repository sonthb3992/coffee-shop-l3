import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderItem, calculatePrice, getDescription, getDescriptionVi } from '../domain/selected_item';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFromCart, setItemQuantity } from '../reducer/cartSlice';
import QuantitySelector from './quanlity-selector';
import { useTranslation } from 'react-i18next';
import { RootState } from '../reducer/store';

interface MenuOptionProps {
    option: OrderItem;
    canEditQuantity: boolean;
    canDelete: boolean;
    canReview: boolean;
}

const CartPageItem: React.FC<MenuOptionProps> = ({ option: item, canEditQuantity = true, canDelete = true, canReview = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const language = useSelector((state: RootState) => state.cart.language);
    const { t } = useTranslation();

    const handleDelete = () => {
        if (item.id)
            dispatch(deleteFromCart(item.id));
    }


    const handleOnQuantityChanged = (value: number) => {
        dispatch(setItemQuantity({ id: item.id!, quantity: value }));
    }

    return (
        <article className="media mb-0">
            <figure className="media-left   ">
                <p className="image is-64x64">
                    <img src={item.menuOption!.imageUrl}></img>
                </p>
            </figure>
            <div className="media-content">
                <div className="content">
                    <p>
                        <div className='level m-0'>
                            <div className='level-left'>
                                <strong>{language === "en" ? item.menuOption!.nameEn : item.menuOption!.nameVi}</strong>
                            </div>
                            <div className='level-right'>
                                <strong className='has-text-primary'>${calculatePrice(item).toFixed(2)}</strong>
                            </div>
                        </div>
                        <small className='has-text-weight-normal'>{language === "en" ? getDescription(item) : getDescriptionVi(item)}</small>
                    </p>
                </div>
                <nav className="level">
                    <div className="level-left">
                        {
                            canEditQuantity &&
                            <QuantitySelector min={1} max={99} disabled={!canEditQuantity} current={item.quantity} onQuantityChanged={(value) => handleOnQuantityChanged(value)}></QuantitySelector>
                        }
                        {
                            canReview && <nav className="level is-mobile">
                                <div className="level-left">
                                    <a className="level-item has-text-decoration-none" href='#' title='Reorder'>
                                        <span className="icon is-small"><i className="fa-solid fa-rotate-right"></i></span>
                                    </a>
                                    <a className="level-item has-text-decoration-none has-text-info" title='Like'>
                                        <span className="icon is-small"><i className="fa-solid fa-thumbs-up"></i></span>
                                    </a>
                                    <a className="level-item has-text-decoration-none has-text-danger-dark" title='Dislike'>
                                        <span className="icon is-small"><i className="fa-solid fa-thumbs-down"></i></span>
                                    </a>
                                </div>
                            </nav>
                        }
                    </div>
                </nav>
            </div >
            {canDelete &&
                <div className="media-right">
                    <button className="delete" onClick={handleDelete}></button>
                </div>
            }
        </article >
    );
};

export default CartPageItem;
