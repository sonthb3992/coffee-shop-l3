import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChallengeForm from '../view/challenge-form';
import { ChallengeAnswer, GetAllAnswers } from '../domain/answer_challenge';
import AnswerItem from '../view/answer-item';
import './css/challenges.css';
const ChallengesPage: React.FC = () => {
  const { t } = useTranslation();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [isButtonAnimated, setButtonAnimated] = useState(false);
  const [answers, setAnswers] = useState<ChallengeAnswer[]>([]);

  const handleOpenForm = () => {
    setShowForm(true);
  };

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      setButtonAnimated(true);
    }, 500);

    const fetchAnswers = async () => {
      const result = await GetAllAnswers();
      setAnswers(result);
    };

    fetchAnswers();

    return () => {
      clearTimeout(animationTimeout);
    };
  }, []);

  return (
    <div>
      <section className="Banner">
        <div className="Body">
          <div className="container">
            <h2 className="title has-text-white">Food Time</h2>
            <h2 className="title has-text-white">Check-In Challenge </h2>
            <p className="subtitle has-text-white">
              Capture the essence of Food Time in a single photo and win
              exciting rewards. 📸✨
            </p>
            <div
              className={`button-wrapper ${isButtonAnimated ? 'animated' : ''}`}
              style={{
                opacity: isButtonAnimated ? 1 : 0,
                transform: `translateY(${isButtonAnimated ? '0' : '-10px'})`,
                transition: 'opacity 1s, transform 1s',
              }}
            >
              <button className="button" onClick={handleOpenForm}>
                Start Challenge!!
              </button>
            </div>
          </div>
        </div>
      </section>
      {showForm && (
        <section className="section">
          <ChallengeForm isModal={false}></ChallengeForm>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="columns is-mobile is-multiline">
            {answers.map((answer) => (
              <div key={answer.uid} className="column is-half-desktop">
                <AnswerItem answer={answer} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChallengesPage;
