import React, { useEffect, useState } from 'react';
import {
  OrderItem,
  calculatePrice,
  getDescription,
  getDescriptionVi,
} from '../domain/selected_item';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFromCart, setItemQuantity } from '../reducer/cartSlice';
import QuantitySelector from './quanlity-selector';
import { RootState } from '../reducer/store';
import { addItemToCart } from '../reducer/cartSlice';
import { Review } from '../domain/review';
import defaultPhoto from '../assets/images/default-avatar.png';
import Rating from './rating';

interface ReviewItemProps {
  review: Review;
  level?: number;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review: currentReview,
  level,
}) => {
  const dispatch = useDispatch();

  const language = useSelector((state: RootState) => state.cart.language);
  const user = useSelector((state: RootState) => state.cart.user);
  const [showComment, setShowComment] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {}, [currentReview]);

  return (
    <div className="card p-4 mb-3">
      <article className="media mb-0">
        <figure className="media-left   ">
          <p className="image is-64x64">
            <img
              src={
                currentReview.reviewerImageUrl !== ''
                  ? currentReview.reviewerImageUrl
                  : defaultPhoto
              }
              alt="reviewer image"
            ></img>
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <div className="level m-0">
              <div className="level-left">
                <div className="is-flex is-flex-direction-column">
                  <strong className="is-size-6">
                    {currentReview.reviewerName}
                  </strong>
                  <i className="is-size-6">
                    {currentReview.reviewDateTime.toLocaleString(`${language}`)}
                  </i>
                </div>
              </div>
              <div className="level-right">
                <strong className="has-text-primary">
                  <Rating
                    disabled={true}
                    fixedRating={currentReview.rating}
                  ></Rating>
                </strong>
              </div>
            </div>
            <small className="has-text-weight-normal">
              {currentReview.comment}
            </small>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ReviewItem;
