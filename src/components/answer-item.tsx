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
import {
  ChallengeAnswer,
  ChallengeReply,
  GetChallengeReplies,
  ReplyToChallengeAnswer,
  VerifyAnswer,
} from '../domain/answer_challenge';
import ChallengeReplyItem from './challenge-reply-item';

interface AnswerItemProps {
  answer: ChallengeAnswer;
  level?: number;
  showUserAvatar?: boolean;
  elevated?: boolean;
}

const AnswerItem: React.FC<AnswerItemProps> = ({
  answer: currentAnswer,
  showUserAvatar: showUserAvatar = true,
  elevated: elevated = true,
}) => {
  const dispatch = useAppDispatch();
  const language = useSelector((state: RootState) => state.cart.language);
  const userData = useAppSelector((state) => state.user.userData);
  const [verified, setVerified] = useState<boolean>(false);
  const [replying, setReplying] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [replies, setReplies] = useState<ChallengeReply[]>([]);
  const [showReplies, setShowReplies] = useState<boolean>(false);

  const sendReply = async () => {
    setIsBusy(true);
    const user = auth.currentUser;
    if (user) {
      const newReply: ChallengeReply = {
        uid: '',
        useruid: user.uid,
        comment: replyText,
        timestamp: new Date(Date.now()),
        userAvatarUrl: user.photoURL ?? '',
        userDisplayName: user.displayName ?? '',
      };

      const result = await ReplyToChallengeAnswer(currentAnswer.uid, newReply);
      if (result === true) {
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
    console.log(`anser uid: ${currentAnswer.uid}`);
    if (currentAnswer.uid) {
      const _replies = await GetChallengeReplies(currentAnswer.uid);
      console.log(_replies);
      setReplies(_replies);
      setShowReplies(true);
    }
  };

  const canVerify = (): boolean => {
    if (userData === null) return false;
    return userData.role === 'barista' || userData.role === 'staff';
  };

  const onSetVerified = async () => {
    if (currentAnswer.uid) {
      const _success = await VerifyAnswer(currentAnswer.uid);
      setVerified(_success);
    }
  };

  useEffect(() => {
    dispatch(fetchUserData());
  }, [currentAnswer, dispatch]);

  return (
    <div className={`${elevated ? 'card' : ''} p-4 mb-3`}>
      <article className="media mb-0">
        {showUserAvatar && (
          <figure className="media-left   ">
            <p className="image is-64x64">
              <img
                src={
                  currentAnswer.userAvatarUrl !== ''
                    ? currentAnswer.userAvatarUrl
                    : defaultPhoto
                }
                alt="reviewer avatar"
              ></img>
            </p>
          </figure>
        )}
        <div className="media-content">
          <div className="content">
            <div className="level m-0">
              <div className="level-left">
                <div className="is-flex is-flex-direction-column">
                  <strong className="is-size-6">
                    {currentAnswer.userDisplayName ?? 'Anonymous user'}
                  </strong>
                </div>
              </div>
              <div className="level-right">
                <i className="is-size-7">
                  {currentAnswer.timestamp.toLocaleString(`${language}`)}
                </i>
              </div>
            </div>
            <figure className="image">
              {currentAnswer.imageUrl && (
                <img src={currentAnswer.imageUrl}></img>
              )}
            </figure>
            <p className="has-text-weight-normal">{currentAnswer.comment}</p>
            <div className="level is-mobile mb-1">
              <div className="level-left"></div>
              <div className="level-right">
                <div className="buttons">
                  <button
                    className="button is-small is-primary is-size-7"
                    onClick={() => setReplying(true)}
                  >
                    Reply
                  </button>
                  {canVerify() && !verified && (
                    <button
                      className="button is-small is-link is-size-7"
                      onClick={onSetVerified}
                    >
                      Verify
                    </button>
                  )}
                  {verified && (
                    <button className="button is-small is-primary is-size-7 is-static">
                      This challenge has been verified
                    </button>
                  )}
                  {!showReplies ? (
                    <button
                      className="button is-small is-info is-size-7"
                      onClick={() => loadReplies()}
                    >
                      Show UnA's reply
                    </button>
                  ) : (
                    <button
                      className="button is-small is-info is-size-7"
                      onClick={() => setShowReplies(false)}
                    >
                      Hide UnA's reply
                    </button>
                  )}
                </div>
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
                <ChallengeReplyItem reply={r} key={r.uid}></ChallengeReplyItem>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default AnswerItem;
