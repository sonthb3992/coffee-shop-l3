import { User } from 'firebase/auth';
import React from 'react';
import defaultAvatar from '../assets/images/default-avatar.png'

interface UserInfoProps {
    user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    return (
        <figure className='navbar-item is-rounded'>
            <p className="image is-48x48">
                {user.photoURL && <img src={user.photoURL} alt="User Avatar" />}
                {!user.photoURL && <img src={defaultAvatar} alt="User Avatar" className='navbar-avatar is-rounded' />}
            </p>
        </figure>
    );
};

export default UserInfo;