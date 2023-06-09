import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { GetReplies, ReplyToReview, Review } from '../domain/review';
import defaultPhoto from '../assets/images/default-avatar.png';
import Rating from './rating';
import { auth } from '../domain/firebase';
import { useAppDispatch, useAppSelector } from '../reducer/hook';
import { fetchUserData } from '../reducer/user-slice';
import ReplyItem from './reply-item';

interface ReviewItemProps {
  review: Review;
  level?: number;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review: currentReview,
  level,
}) => {
  const dispatch = useAppDispatch();
  const language = useSelector((state: RootState) => state.cart.language);
  const userData = useAppSelector((state) => state.user.userData);
  const [replying, setReplying] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [replies, setReplies] = useState<Review[]>([]);
  const [showReplies, setShowReplies] = useState<boolean>(false);

  const sendReply = async () => {
    setIsBusy(true);
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
    loadReplies();
    setIsBusy(false);
  };

  const onReplyChanged = (comment: string) => {
    setReplyText(comment);
  };

  const cancelReply = () => {
    setReplyText('');
    setReplying(false);
  };

  const loadReplies = async () => {
    const _replies = await GetReplies(currentReview.uid);
    setReplies(_replies);
    setShowReplies(true);
  };

  useEffect(() => {
    dispatch(fetchUserData());
  }, [currentReview, dispatch]);

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
              alt="reviewer avatar"
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
                  <Rating
                    disabled={true}
                    fixedRating={currentReview.rating}
                  ></Rating>
                </div>
              </div>
              <div className="level-right">
                <i className="is-size-7">
                  {currentReview.reviewDateTime.toLocaleString(`${language}`)}
                </i>
              </div>
            </div>
            <p className="has-text-weight-normal">{currentReview.comment}</p>
            <div className="level is-mobile mb-1">
              <div className="level-left"></div>
              <div className="level-right">
                {userData &&
                  (userData.role === 'barista' ||
                    userData.role === 'staff') && (
                    <button
                      className="button is-small is-primary is-size-7"
                      onClick={() => setReplying(true)}
                    >
                      Reply
                    </button>
                  )}
                {currentReview.hasReply &&
                  currentReview.hasReply === true &&
                  (!showReplies ? (
                    <button
                      className="button is-small is-info is-size-7 ml-2"
                      onClick={() => loadReplies()}
                    >
                      Show UnA's reply
                    </button>
                  ) : (
                    <button
                      className="button is-small is-info is-size-7 ml-2"
                      onClick={() => setShowReplies(false)}
                    >
                      Hide UnA's reply
                    </button>
                  ))}
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
                <div className="buttons">
                  <button
                    onClick={sendReply}
                    className={`button mt-1 is-small is-primary ${
                      replyText === '' ? 'is-static' : ''
                    } ${isBusy ? 'is-loading' : ''}`}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-paper-plane"></i>
                    </span>
                  </button>
                  <button
                    onClick={cancelReply}
                    className="button mt-1 is-small"
                  >
                    <span className="icon is-small">
                      <i className="fas fa-close"></i>
                    </span>
                  </button>
                </div>
              </div>
            )}
            {replies.length > 0 &&
              showReplies &&
              replies.map((r) => (
                <ReplyItem review={r} key={r.uid}></ReplyItem>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default ReviewItem;
