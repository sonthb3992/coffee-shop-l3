import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetRecentReviews, GetShopRating, Review } from '../domain/review';
import ReviewItem from '../view/review-item';
import Rating from '../view/rating';

const TestimonialsPage: React.FC = () => {
  const { t } = useTranslation();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>();

  useEffect(() => {
    const fetchReviews = async () => {
      const result = await GetRecentReviews();
      setReviews(result);
    };
    const fetchShopRating = async () => {
      const result = await GetShopRating();
      setRating(result);
    };

    fetchReviews();
    fetchShopRating();
  }, [rating]);

  return (
    <div>
      <section className="hero is-small is-info">
        <div className="container hero-body has-text-centered">
          <p className="title mb-0">Our rating</p>
          <Rating disabled={true} fixedRating={rating}></Rating>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="columns is-mobile is-multiline">
            {reviews.map((option) => (
              <div className="column is-half-desktop">
                <ReviewItem review={option} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;
