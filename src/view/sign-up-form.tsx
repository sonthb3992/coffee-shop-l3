import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducer/cartSlice';

const SignUpForm: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert(t('signup.error'));
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name,
        })
          .then(() => {
            dispatch(setUser(userCredential.user));
          })
          .catch((error) => {});
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`${errorCode} : ${errorMessage}`);
      });
  };

  return (
    <div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            placeholder={t('signup.namePlaceholder').toString()}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder={t('signup.emailPlaceholder').toString()}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('signup.passwordPlaceholder').toString()}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('signup.confirmPasswordPlaceholder').toString()}
          />
        </div>
      </div>
      <button
        className="button is-block is-info is-fullwidth"
        onClick={() => handleSignup()}
      >
        {t('signup.signupButton')}{' '}
        <i className="fa fa-user-plus" aria-hidden="true" />
      </button>
    </div>
  );
};

export default SignUpForm;