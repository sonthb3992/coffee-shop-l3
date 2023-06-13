import React, { useEffect, useState } from 'react';
import {
  OrderItem,
  calculatePrice,
  getDescription,
  getDescriptionVi,
} from '../domain/selected_item';
import { useSelector } from 'react-redux';
import { deleteFromCart, setItemQuantity } from '../reducer/cartSlice';
import QuantitySelector from './quanlity-selector';
import { RootState } from '../reducer/store';
import { addItemToCart } from '../reducer/cartSlice';
import { auth } from '../domain/firebase';
import { ToggleUserFavorite } from '../domain/user';
import { fetchUserData } from '../reducer/user-slice';
import { useAppDispatch } from '../reducer/hook';
import { Review } from '../domain/review';
import { MenuOption } from '../domain/menu_option';

interface MenuOptionProps {
  option: OrderItem;
  canEditQuantity: boolean;
  canDelete: boolean;
  canReview?: boolean;
}

const CartPageItem: React.FC<MenuOptionProps> = ({
  option: item,
  canEditQuantity = true,
  canDelete = true,
  canReview = false,
}) => {
  const dispatch = useAppDispatch();

  const language = useSelector((state: RootState) => state.cart.language);
  const userUid = useSelector((state: RootState) => state.user.userUid);
  const userData = useSelector((state: RootState) => state.user.userData);

  const [showComment, setShowComment] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [liked, setLiked] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const handleDelete = () => {
    if (item.id) dispatch(deleteFromCart(item.id));
  };

  const handleOnQuantityChanged = (value: number) => {
    dispatch(setItemQuantity({ id: item.id!, quantity: value }));
  };

  const handleReorder = () => {
    dispatch(addItemToCart(item));
  };

  const handleLikeToggle = async (liked: boolean) => {
    const user = auth.currentUser;
    if (!user) return;
    if (item.id) {
      const result = await ToggleUserFavorite(user.uid, item.id);
      if (result === 'success') {
        setLiked(!liked);
      }
    }
  };

  const handleCommentToggle = () => {
    if (showComment) {
      setCommentText('');
    }
    setShowComment(!showComment);
  };

  const handleCommentChanged = (value: string) => {
    setCommentText(value);
  };

  const handleSendComment = async () => {
    if (!item.menuOption) {
      alert('Unexpected error while sending comment.');
      return;
    }

    setIsBusy(true);
    const user = auth.currentUser;
    if (user) {
      const review: Review = {
        orderId: '',
        parentId: '',
        rating: 0,
        userUid: user.uid,
        comment: commentText,
        uid: '',
        isPublic: true,
        reviewerName: user.displayName ?? 'Anonymous user',
        reviewerImageUrl: user.photoURL ?? '',
        reviewDateTime: new Date(Date.now()),
      };
      const result = await MenuOption.addReview(item.menuOption, review);
      if (!result) {
        alert('Unexpected error while sending comment.');
        handleCancelComment();
      }
    }
    setIsBusy(false);
  };

  const handleCancelComment = () => {
    setCommentText('');
    setShowComment(false);
  };

  useEffect(() => {
    dispatch(fetchUserData());

    if (item.id && userData) {
      setLiked(userData?.favorites.includes(item.id));
    }
  }, [userUid, userData]);

  return (
    <div className="card p-4 mb-3">
      <article className="media mb-0">
        <figure className="media-left   ">
          <p className="image is-64x64">
            <img
              src={item.menuOption!.imageUrl}
              alt={item.menuOption!.nameEn}
            ></img>
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <p>
              <div className="level m-0">
                <div className="level-left">
                  <span>
                    <strong>
                      {language === 'en'
                        ? item.menuOption!.nameEn
                        : item.menuOption!.nameVi}
                    </strong>
                    {!canEditQuantity && (
                      <i className="ml-2">{`x${item.quantity}`}</i>
                    )}
                  </span>
                </div>
                <div className="level-right">
                  <strong className="has-text-primary">
                    ${calculatePrice(item).toFixed(2)}
                  </strong>
                </div>
              </div>
              <small className="has-text-weight-normal">
                {language === 'en'
                  ? getDescription(item)
                  : getDescriptionVi(item)}
              </small>
            </p>
          </div>
          <nav className="level">
            <div className="level-left">
              {canEditQuantity && (
                <QuantitySelector
                  min={1}
                  max={99}
                  disabled={!canEditQuantity}
                  current={item.quantity}
                  onQuantityChanged={(value) => handleOnQuantityChanged(value)}
                ></QuantitySelector>
              )}
              {canReview && (
                <nav className="level is-mobile">
                  <div className="level-left">
                    <div
                      role="button"
                      onClick={() => handleReorder()}
                      className="level-item has-text-decoration-none has-cursor-hand has-text-info"
                      title="Reorder"
                    >
                      <span className="icon is-small">
                        <i className="fa-solid fa-rotate-right"></i>
                      </span>
                    </div>
                    <div
                      role="button"
                      onClick={() => handleLikeToggle(liked)}
                      className="level-item has-text-decoration-none"
                      title="Like"
                    >
                      <span
                        className="icon is-small has-cursor-hand"
                        title="Add to favorite"
                      >
                        {liked ? (
                          <i className="fa-solid fa-heart has-text-danger"></i>
                        ) : (
                          <i className="fa-regular fa-heart has-text-info"></i>
                        )}
                      </span>
                    </div>
                    <div
                      role="button"
                      onClick={handleCommentToggle}
                      className="level-item has-text-decoration-none has-text-danger-dark"
                      title="Comment"
                    >
                      <span className="icon is-small">
                        <i className="fa-regular fa-message"></i>
                      </span>
                    </div>
                  </div>
                </nav>
              )}
            </div>
          </nav>
          {showComment && (
            <div className="content">
              <div>
                <textarea
                  rows={2}
                  value={commentText}
                  maxLength={200}
                  onChange={(event) => handleCommentChanged(event.target.value)}
                  className="textarea is-primary has-fixed-size"
                  placeholder="Reply here"
                ></textarea>
                <div className="buttons">
                  <button
                    onClick={handleSendComment}
                    className={`${commentText === '' ? 'is-static' : ''} ${
                      isBusy ? 'is-loading' : ''
                    } button mt-1 is-small is-primary`}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-paper-plane"></i>
                    </span>
                  </button>
                  <button
                    onClick={handleCancelComment}
                    className="button mt-1 is-small"
                  >
                    <span className="icon is-small">
                      <i className="fas fa-close"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {canDelete && (
          <div className="media-right">
            <button className="delete" onClick={handleDelete}></button>
          </div>
        )}
      </article>
    </div>
  );
};
export default CartPageItem;
