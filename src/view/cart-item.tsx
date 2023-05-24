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
}

const CartPageItem: React.FC<MenuOptionProps> = ({ option: item, canEditQuantity = true, canDelete = true }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const language = useSelector((state: RootState) => state.cart.language);
    const { t } = useTranslation();

    const handleDelete = () => {
        if (item.id)
            dispatch(deleteFromCart(item.id));
    }

    const handleEdit = () => {
        //dispatch(setEditingItem(option));
        navigate(`/customize-order/${item.menuOption?.nameEn}/true`);
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
                        <small>{language === "en" ? getDescription(item) : getDescriptionVi(item)}</small>
                    </p>
                </div>
                <nav className="level">
                    <div className="level-left">
                        <QuantitySelector min={1} max={99} disabled={!canEditQuantity} current={item.quantity} onQuantityChanged={(value) => handleOnQuantityChanged(value)}></QuantitySelector>
                    </div>
                </nav>
            </div>
            {canDelete &&
                <div className="media-right">
                    <button className="delete" onClick={handleDelete}></button>
                </div>
            }
        </article >
    );
};

export default CartPageItem;
