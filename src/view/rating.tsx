import React, { useState } from 'react';
import './rating.css';

interface RatingProps {
  disabled?: boolean;
  onRatingChanged: (newRating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ disabled, onRatingChanged }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [tempRating, setTempRating] = useState<number | null>(null);

  const rate = (_newRating: number) => {
    if (!disabled) {
      setRating(_newRating);
      setTempRating(_newRating);
      onRatingChanged(_newRating);
    }
  };

  const starOver = (_newRating: number) => {
    if (!disabled) {
      setTempRating(rating);
      setRating(_newRating);
    }
  };

  const starOut = () => {
    if (!disabled) {
      setRating(tempRating);
    }
  };

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    let klass = 'star-rating__star';

    if (!disabled && rating !== null && rating >= i) {
      klass += ' is-selected';
    }

    stars.push(
      <label
        key={i}
        className={klass}
        onClick={() => rate(i)}
        onMouseOver={() => starOver(i)}
        onMouseOut={starOut}
      >
        ★
      </label>
    );
  }

  return <div className="star-rating">{stars}</div>;
};

export default Rating;
