import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import {
  setAddress,
  setCustomerName,
  setPhone,
  setUser,
} from '../reducer/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AvatarUploader from '../view/avatar-uploader';
import { User, getAuth, updateProfile } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { app } from '../domain/firebase';
import { UpdateUserDataToFirebase, signUserOut } from '../domain/user';

const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();

  const user = useSelector((state: RootState) => state.cart.user);
  const address = useSelector((state: RootState) => state.cart.address);
  const name = useSelector((state: RootState) => state.cart.customer_name);
  const phone = useSelector((state: RootState) => state.cart.phone);
  const [userImageUrl, setUserImageUrl] = useState<string>('');

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleAddressChange = (newAddress: string) => {
    dispatch(setAddress(newAddress));
  };

  const handlePhoneChange = (newPhone: string) => {
    dispatch(setPhone(newPhone));
  };

  const handleCustomerNameChange = (newName: string) => {
    dispatch(setCustomerName(newName));
  };

  const handleUserLogout = async () => {
    await signUserOut();
    dispatch(setUser(null));
    navigate('/');
  };

  const saveUserData = () => {
    if (user) {
      UpdateUserDataToFirebase(user, name, address, phone);
      if (userImageUrl) {
        const auth = getAuth();
        if (auth.currentUser)
          updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: userImageUrl,
          })
            .then(() => {})
            .catch((error) => {
              console.log(error);
            });
      }
      alert('User information updated.');
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchUserData = async (uid: string) => {
      const db = getFirestore(app);
      const userRef = doc(collection(db, 'users'), uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const _address = userData.address;
        const _name = userData.name;
        const _phone = userData.phone;
        dispatch(setAddress(_address));
        dispatch(setCustomerName(_name));
        dispatch(setPhone(_phone));
      } else {
        console.log('User document does not exist.');
      }
    };

    if (user) fetchUserData(user?.uid);
  }, [user, dispatch]);

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-desktop">
          <div className="column is-half-desktop p-3">
            <p className="title is-4 pt-5">{t('Change user information')}</p>
            <div className="field">
              <label className="label">{t('Email')}</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className={`input is-success`}
                  readOnly
                  type="text"
                  value={user?.email ?? ''}
                ></input>
                <span className="icon is-small is-left">
                  <i className="fa-regular fa-envelope"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">{t('ReceiverName')}</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className={`input ${name ? 'is-success' : 'is-danger'}`}
                  type="text"
                  value={name}
                  onChange={(event) =>
                    handleCustomerNameChange(event.target.value)
                  }
                  placeholder="enter your name"
                ></input>
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
              {!name && (
                <p className="help is-danger">{t('ReceiverName_invalid')}</p>
              )}
            </div>
            <div className="field">
              <label className="label">{t('Phone number')}</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className={`input ${phone ? 'is-success' : 'is-danger'}`}
                  type="text"
                  value={phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  placeholder="enter phone number"
                ></input>
                <span className="icon is-small is-left">
                  <i className="fas fa-phone"></i>
                </span>
              </div>
              {!phone && (
                <p className="help is-danger">{t('Phone number invalid')}</p>
              )}
            </div>
            <div className="field">
              <label className="label">{t('Address')}</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className={`input ${address ? 'is-success' : 'is-danger'}`}
                  type="email"
                  value={address}
                  onChange={(event) => handleAddressChange(event.target.value)}
                  placeholder="enter delivery address"
                ></input>
                <span className="icon is-small is-left">
                  <i className="fas fa-map"></i>
                </span>
              </div>
              {!address && (
                <p className="help is-danger">{t('Address invalid')}</p>
              )}
            </div>
            <div className="buttons">
              <button
                className={`button is-primary`}
                onClick={() => saveUserData()}
              >
                {t('Save changes')}
              </button>
              <button
                className={`button is-danger`}
                onClick={() => handleUserLogout()}
              >
                {t('Logout')}
              </button>
            </div>
          </div>

          <div className="column is-half-desktop p-3">
            <div className="card p-5">
              <div className="level">
                <div className="level-left">
                  <p className="title is-4">{t('Avatar')}</p>
                </div>
              </div>
              <AvatarUploader
                onImageUrlChanged={(newUrl) => setUserImageUrl(newUrl)}
              ></AvatarUploader>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfilePage;
