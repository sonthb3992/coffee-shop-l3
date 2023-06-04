import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetRecentReviews, Review } from '../domain/review';
import ReviewItem from '../view/review-item';

const TestimonialsPage: React.FC = () => {
  const { t } = useTranslation();

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const result = await GetRecentReviews();
      setReviews(result);
    };

    fetchReviews();
  }, []);

  return (
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
  );
};

export default TestimonialsPage;
