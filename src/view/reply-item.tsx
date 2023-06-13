import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { Review } from '../domain/review';
import defaultPhoto from '../assets/images/default-avatar.png';

interface ReplyItemProps {
  review: Review;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ review: currentReview }) => {
  const language = useSelector((state: RootState) => state.cart.language);

  useEffect(() => {}, [currentReview]);

  return (
    <div className="">
      <article className="media mb-0">
        <figure className="media-left   ">
          <p className="image is-64x64">
            <img
              src={
                currentReview.reviewerImageUrl !== ''
                  ? currentReview.reviewerImageUrl
                  : defaultPhoto
              }
              alt="reviewer avatar"
            ></img>
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <div className="is-flex is-flex-direction-row is-justify-content-space-between">
              <strong className="is-size-6">
                {currentReview.reviewerName}
              </strong>
              <i className="is-size-7">
                {currentReview.reviewDateTime.toLocaleString(`${language}`)}
              </i>
            </div>
            <p className="has-text-weight-normal">{currentReview.comment}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ReplyItem;
