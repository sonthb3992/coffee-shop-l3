import React, { useEffect, useState } from 'react';
import { PushReviewToFirebase, Review } from '../domain/review';
import { useTranslation } from 'react-i18next';
import { Order } from '../domain/order';
import Rating from './rating';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';

interface ChallengeFormProps {
  isModal: boolean;
  order: Order;
  isActived?: boolean;
  onClose?: () => void;
}

const ChallengeForm: React.FC<ChallengeFormProps> = ({
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
    setCommentLabel('challengeForm.' + newRating.toString() + 'star');
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
      const result = await PushReviewToFirebase(review, order);
      setIsSending(false);
      if (result === 'success') {
        handleCancel();
        return;
      }
      setIsSending(false);
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
            <p className="modal-card-title">{t('Challenge form')}</p>
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
          {/* Image Form */}
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

export default ChallengeForm;
