import { User } from 'firebase/auth';
import React, { useState } from 'react';
import defaultAvatar from '../assets/images/default-avatar.png'
import { useNavigate } from 'react-router-dom';

interface UserInfoProps {
    user: User;
}

const UserInfoComponent: React.FC<UserInfoProps> = ({ user }) => {
    const navigate = useNavigate();

    const handleAvatarClick = () => {
        navigate("/user-profile");
    };

    return (
        <div className='user-info'>
            <figure className='navbar-item is-rounded' onClick={handleAvatarClick}>
                <p className="image is-48x48">
                    {user.photoURL && <img src={user.photoURL} alt="User Avatar" />}
                    {!user.photoURL && <img src={defaultAvatar} alt="User Avatar" className='navbar-avatar is-rounded has-background-link-light' />}
                </p>
            </figure>
        </div>
    );
};

export default UserInfoComponent;