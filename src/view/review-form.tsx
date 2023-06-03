import React, { useEffect, useState } from 'react';
import { PushReviewToFirebase, Review } from '../domain/review';
import { useTranslation } from 'react-i18next';
import { Order } from '../domain/order';
import Rating from './rating';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
//import Rating from 'react-simple-star-rating'

interface ReviewFormProps {
  isActived: boolean;
  order: Order;
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  isActived,
  order,
  onClose,
}) => {
  const [actived, setActived] = useState<boolean>(false);
  const [commentLabel, setCommentLabel] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.cart.user);

  const { t } = useTranslation();

  const handleCancel = () => {
    setActived(false);
    onClose();
  };

  const onRatingChanged = (newRating: number) => {
    console.log(newRating);
    setRating(newRating);
    setCommentLabel('reviewForm.' + newRating.toString() + 'star');
  };

  const onCommentChanged = (comment: string) => {
    setComment(comment);
  };

  const sendReview = async () => {
    if (user) {
      const review: Review = {
        orderId: order.id,
        parentId: '',
        rating: rating,
        userUid: user?.uid,
        comment: comment,
        uid: '',
        isPublic: false,
      };
      setIsSending(true);
      const result = await PushReviewToFirebase(review);
      setIsSending(false);
      if (result === 'success') {
        handleCancel();
        return;
      }
      alert(result);
    }
  };

  useEffect(() => {
    setActived(isActived);
  }, [isActived]);

  return (
    <div className={`modal ${actived ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{t('Review order')}</p>
          <button
            className="delete"
            onClick={() => handleCancel()}
            aria-label="close"
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="block is-flex is-justify-content-center">
            <label className="title is-5">{t('reviewForm.plsRate')}</label>
          </div>
          <div className="block is-flex is-justify-content-center">
            <Rating
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
                maxLength={500}
                onChange={(event) => onCommentChanged(event.target.value)}
                className="textarea is-primary has-fixed-size"
                placeholder={t('reviewForm.commentPlaceholder').toString()}
              ></textarea>
            </div>
          )}
        </section>
        <footer className="modal-card-foot">
          <button
            onClick={() => sendReview()}
            className={`button is-success ${isSending ? 'is-loading' : ''}`}
          >
            Sent
          </button>
          <button className="button" onClick={() => handleCancel()}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ReviewForm;