import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import defaultPhoto from '../assets/images/default-avatar.png';
import { ChallengeReply } from '../domain/answer_challenge';

interface ReplyItemProps {
  reply: ChallengeReply;
}

const ChallengeReplyItem: React.FC<ReplyItemProps> = ({
  reply: currentReply,
}) => {
  const language = useSelector((state: RootState) => state.cart.language);

  useEffect(() => { }, [currentReply]);

  return (
    <div className="">
      <article className="media mb-0">
        <figure className="media-left   ">
          <p className="image is-64x64">
            <img
              src={
                currentReply.userAvatarUrl
                  ? currentReply.userAvatarUrl
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
                {currentReply.userDisplayName}
              </strong>
              <i className="is-size-7">
                {currentReply.timestamp.toLocaleString(`${language}`)}
              </i>
            </div>
            <p className="has-text-weight-normal">{currentReply.comment}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ChallengeReplyItem;
