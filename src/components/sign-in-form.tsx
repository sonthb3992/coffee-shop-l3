import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setUserRole } from '../reducer/cartSlice';
import { GetUserRole } from '../domain/user';

const SignInForm: React.FC = () => {
  const { t } = useTranslation();
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      alert(t('login.error'));
      return;
    }

    setIsBusy(true);
    try {
      var userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      dispatch(setUser(user));
      const role = await GetUserRole(user.uid);
      if (role && role !== '') {
        dispatch(setUserRole(role));
        switch (role) {
          case 'customer':
            navigate('/');
            break;
          case 'staff':
            navigate('/staff');
            break;
          case 'barista':
            navigate('/barista');
            break;
          default:
            navigate('/');
            break;
        }
      }
      navigate('/');
    } catch (error) {
      console.log(error);
    }
    setIsBusy(false);
  };

  return (
    <div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            placeholder={t('login.emailPlaceholder').toString()}
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
            placeholder={t('login.passwordPlaceholder').toString()}
          />
        </div>
      </div>
      <div className="field">
        <label className="checkbox">
          <input type="checkbox" /> {t('login.rememberMe')}
        </label>
      </div>
      <button
        className={`button is-block is-info is-fullwidth ${
          isBusy ? 'is-loading' : ''
        }`}
        onClick={() => handleSignIn()}
      >
        {t('login.loginButton')}{' '}
        <i className="fa fa-sign-in" aria-hidden="true" />
      </button>
    </div>
  );
};

export default SignInForm;
