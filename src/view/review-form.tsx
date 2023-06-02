import React, { useEffect, useState } from 'react';
import { Review } from '../domain/review';
import { useTranslation } from 'react-i18next';
import { Order } from '../domain/order';
import { Rating } from 'react-simple-star-rating/dist/components/Rating';
//import Rating from 'react-simple-star-rating'

interface ReviewFormProps {
    isActived: boolean,
    order: Order,
    onClose: () => void
}

const ReviewForm: React.FC<ReviewFormProps> = ({ isActived, order, onClose }) => {


    const [actived, setActived] = useState<boolean>(false);
    const [rating, setRating] = useState(0) // initial rating value

    const { t } = useTranslation();

    const handleCancel = () => {
        setActived(false);
        onClose();
    }

    useEffect(() => {
        setActived(isActived);
    }, [isActived]);


    return (
        <div className={`modal ${actived ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{t('Review order')}</p>
                    <button className="delete" onClick={() => handleCancel()} aria-label="close"></button>
                </header>
                <section className="modal-card-body">
                    <Rating 
                        onClick={(rate) => (rate)}
                        size={20}
                    ></Rating>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success">Save changes</button>
                    <button className="button">Cancel</button>
                </footer>
            </div>

        </div>
    );
};

export default ReviewForm;
