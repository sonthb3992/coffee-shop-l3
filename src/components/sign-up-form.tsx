import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setUserRole } from '../reducer/cartSlice';
import { CreateUserDataToFirebase } from '../domain/user';

const SignUpForm: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<string>('customer');
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert(t('signup.error'));
      return;
    }
    setIsBusy(true);
    try {
      var userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential) {
        alert('Unexpected error while signup');
        return;
      }
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: name,
      });
      await CreateUserDataToFirebase(user, name, '', '', role);
      dispatch(setUser(userCredential.user));
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
    } catch (error) {
      console.log(error);
      alert('Unexpected error while signup');
      navigate('/');
    }
    setIsBusy(false);
  };

  const handleRoleChanged = (value: string) => {
    console.log(value);
    setRole(value);
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
      <div className="field">
        <div className="control">
          <label className="radio p-2">
            <input
              className="p-2"
              type="radio"
              onChange={(event) => handleRoleChanged(event.target.value)}
              value="customer"
              defaultChecked
              name="answer"
            />
            {' Customer'}
          </label>
          <label className="radio p-2">
            <input
              className="p-2"
              type="radio"
              onChange={(event) => handleRoleChanged(event.target.value)}
              value="staff"
              name="answer"
            />
            {' Staff'}
          </label>
          <label className="radio p-2">
            <input
              className="p-2"
              type="radio"
              onChange={(event) => handleRoleChanged(event.target.value)}
              value="barista"
              name="answer"
            />
            {' Barista'}
          </label>
        </div>
      </div>
      <button
        className={`button is-block is-info is-fullwidth ${
          isBusy ? 'is-loading' : ''
        }`}
        onClick={() => handleSignup()}
      >
        {t('signup.signupButton')}{' '}
        <i className="fa fa-user-plus" aria-hidden="true" />
      </button>
    </div>
  );
};

export default SignUpForm;
