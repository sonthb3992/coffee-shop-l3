import React, { useEffect, useState } from 'react';
import { PushReviewToFirebase, Review } from '../domain/review';
import { useTranslation } from 'react-i18next';
import { Order } from '../domain/order';
import Rating from './rating';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';

interface ReviewFormProps {
  isModal: boolean;
  order: Order;
  //userId: string;
  //orderId: string;

  isActived?: boolean;
  onClose?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  isModal,
  order,
  isActived,
  onClose,
}) => {
  const [actived, setActived] = useState<boolean>(false);
  const [commentLabel, setCommentLabel] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.cart.user);

  const { t } = useTranslation();

  const handleCancel = () => {
    setRating(0);
    setCommentLabel('');
    setComment('');
    setIsPublic(true);
    setIsSending(false);
    setActived(false);
    if (onClose !== undefined) onClose();
  };

  const onRatingChanged = (newRating: number) => {
    setRating(newRating);
    setCommentLabel('reviewForm.' + newRating.toString() + 'star');
  };

  const onCommentChanged = (comment: string) => {
    setComment(comment);
  };

  const handlePublicChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log(ev.target.value);
    setIsPublic(ev.target.value === 'public');
  };

  const sendReview = async () => {
    if (rating === 0) {
      console.log('Rating is 0. Please rate your order.'); // Debugging statement
      alert('Please rate your order.');
      return;
    }
    if (user) {
      const review: Review = {
        orderId: order.id,
        parentId: '',
        rating: rating,
        userUid: user?.uid,
        comment: comment,
        uid: '',
        isPublic: isPublic,
        reviewerName: user.displayName ?? 'Anonymous user',
        reviewerImageUrl: user.photoURL ?? '',
        reviewDateTime: new Date(Date.now()),
      };
      setIsSending(true);
      console.log('Sending review to Firebase:', review); // Debugging statement
      const result = await PushReviewToFirebase(review, order);
      setIsSending(false);
      if (result === 'success') {
        console.log('Review sent successfully'); // Debugging statement
        handleCancel();
        return;
      }
      setIsSending(false);
      console.log('Error sending review:', result); // Debugging statement
      alert(result);
    }
  };

  useEffect(() => {
    if (isActived !== undefined) setActived(isActived);
  }, [isActived]);

  return (
    <div
      className={`${isModal ? 'modal' : ''} ${
        isModal && actived ? 'is-active' : ''
      }`}
    >
      {isModal && <div className="modal-background"></div>}
      <div className="modal-card card">
        {isModal && (
          <header className="modal-card-head">
            <p className="modal-card-title">{t('Review order')}</p>
            <button
              className="delete"
              onClick={() => handleCancel()}
              aria-label="close"
            ></button>
          </header>
        )}
        <section className="modal-card-body">
          <div className="block is-flex is-justify-content-center">
            <label className="title is-5">{t('reviewForm.plsRate')}</label>
          </div>
          <div className="block is-flex is-justify-content-center">
            <Rating
              fixedRating={rating}
              onRatingChanged={(newRating) => onRatingChanged(newRating)}
            ></Rating>
          </div>
          {rating >= 1 && (
            <div className="block is-flex is-justify-content-center">
              <label>{t(commentLabel)}</label>
            </div>
          )}
          {rating >= 1 && (
            <div className="block">
              <textarea
                value={comment}
                rows={3}
                maxLength={500}
                onChange={(event) => onCommentChanged(event.target.value)}
                className="textarea is-primary has-fixed-size"
                placeholder={t('reviewForm.commentPlaceholder').toString()}
              ></textarea>
            </div>
          )}
          {rating >= 1 && (
            <div className="block">
              <div className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="answer"
                    value="public"
                    onChange={handlePublicChanged}
                    defaultChecked
                  ></input>
                  {' Public my review'}
                </label>
                <label className="radio ml-3">
                  <input
                    type="radio"
                    name="answer"
                    value="private"
                    onChange={handlePublicChanged}
                  ></input>
                  {' Do not public my review'}
                </label>
              </div>
            </div>
          )}
        </section>
        <footer className={`${isModal ? 'modal-card-foot' : ''}`}>
          <div className="buttons pl-5 pb-5">
            <button
              onClick={() => sendReview()}
              className={`button is-success ${isSending ? 'is-loading' : ''}`}
            >
              Sent
            </button>
            {isModal && (
              <button className="button" onClick={() => handleCancel()}>
                Cancel
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ReviewForm;
