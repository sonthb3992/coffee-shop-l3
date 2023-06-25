import React, { useEffect, useState } from 'react';
import {
  PutChallengeAnswerToFirebase,
  ChallengeAnswer,
} from '../domain/answer_challenge';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import ChallengeImageUploader from './challenge-image-uploader';

interface ChallengeFormProps {
  isModal: boolean;
  isActived?: boolean;
  onClose?: () => void;
}

const ChallengeForm: React.FC<ChallengeFormProps> = ({
  isModal,
  isActived,
  onClose,
}) => {
  const [actived, setActived] = useState<boolean>(false);
  const [commentLabel, setCommentLabel] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [userImageUrl, setUserImageUrl] = useState<string>('');
  const user = useSelector((state: RootState) => state.cart.user);

  const { t } = useTranslation();

  const handleCancel = () => {
    setCommentLabel('');
    setComment('');
    setIsSending(false);
    setActived(false);
    if (onClose !== undefined) onClose();
  };

  const onCommentChanged = (comment: string) => {
    setComment(comment);
  };

  const onSetUserImageUrl = (url: string) => {
    console.log(url);
    setUserImageUrl(url);
  };

  const sendAnswer = async () => {
    if (user) {
      const challengeAnswer: ChallengeAnswer = {
        uid: '',
        useruid: user?.uid,
        comment: comment,
        isVerified: false,
        timestamp: new Date(Date.now()),
        imageUrl: userImageUrl ?? '',
        userAvatarUrl: user.photoURL ?? '',
        userDisplayName: user.displayName ?? '',
      };
      setIsSending(true);
      const result = await PutChallengeAnswerToFirebase(challengeAnswer);
      setIsSending(false);
      if (result === true) {
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
            <label className="title is-5">{t('reviewForm.plsChallenge')}</label>
          </div>
          <ChallengeImageUploader
            onImageUrlChanged={(newUrl) => onSetUserImageUrl(newUrl)}
          ></ChallengeImageUploader>
          <div className="block is-flex is-justify-content-center">
            <label>{t(commentLabel)}</label>
          </div>
          <div className="block">
            <textarea
              value={comment}
              rows={3}
              maxLength={500}
              onChange={(event) => onCommentChanged(event.target.value)}
              className="textarea is-primary has-fixed-size"
              placeholder={'Share your story here'}
            ></textarea>
          </div>
        </section>
        <footer className={`${isModal ? 'modal-card-foot' : ''}`}>
          <div className="buttons pl-5 pb-5">
            <button
              onClick={() => sendAnswer()}
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
