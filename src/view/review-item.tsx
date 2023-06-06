import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { ReplyToReview, Review } from '../domain/review';
import defaultPhoto from '../assets/images/default-avatar.png';
import Rating from './rating';
import { auth } from '../domain/firebase';

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
  const [replying, setReplying] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');

  const sendReply = async () => {
    const user = auth.currentUser;
    if (user) {
      const result = await ReplyToReview(currentReview, user, replyText);
      if (result === 'success') {
        setReplying(false);
        setReplyText('');
      } else {
        alert('Adding reply failed');
      }
    }
  };

  const onReplyChanged = (comment: string) => {
    setReplyText(comment);
  };

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
            <div className="level is-mobile mb-1">
              <div className="level-left">
                <a className="is-size-7" onClick={() => setReplying(true)}>
                  Reply
                </a>
              </div>
            </div>
            {replying && (
              <div>
                <textarea
                  rows={2}
                  value={replyText}
                  maxLength={200}
                  onChange={(event) => onReplyChanged(event.target.value)}
                  className="textarea is-primary has-fixed-size"
                  placeholder="Reply here"
                ></textarea>
                <button
                  onClick={sendReply}
                  className={`button mt-1 is-small is-primary ${
                    replyText === '' ? 'is-static' : ''
                  }`}
                >
                  <span className="icon is-small">
                    <i className="fas fa-paper-plane"></i>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default ReviewItem;
