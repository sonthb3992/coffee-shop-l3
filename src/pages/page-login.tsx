import React, { useState, useTransition } from 'react';
import './css/login.css'; // Import the CSS file
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/logo.png'
import SignUpForm from '../view/sign-up-form';
import SignInForm from '../view/sign-in-form';

export enum FormType {
    SignIn = 'sign-in',
    SignUp = 'sign-up',
}

interface LoginFormProps {
    formType: FormType;
}

const LoginForm: React.FC<LoginFormProps> = ({ formType }) => {

    const { t } = useTranslation();
    const [currentFormType] = useState<FormType>(formType);

    return (
        <section className="hero is-success is-fullheight">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <div className="card pt-5 column is-4 is-offset-4">
                        <h3 className="title has-text-black">
                            {currentFormType === FormType.SignIn ? t('login.title') : t('signup.title')}
                        </h3>
                        <hr className="login-hr" />
                        <p className="subtitle has-text-black">
                            {currentFormType === FormType.SignIn ? t('login.subtitle') : t('signup.subtitle')}
                        </p>
                        <div className="box">
                            <figure className="avatar" >
                                <img src={logo} alt="Avatar" />
                            </figure>
                            {currentFormType === FormType.SignIn ? <SignInForm /> : <SignUpForm />}
                        </div>
                        <p className="has-text-grey has-text-weight-normal">
                            {currentFormType === FormType.SignIn && <a href="/sign-up">{t('login.signUp')}</a>} &nbsp;&nbsp;
                            {currentFormType === FormType.SignUp && <a href="/login">{t('signup.loginLink')}</a>} &nbsp;&nbsp;
                            {currentFormType === FormType.SignIn && <a href="/reset-password">{t('login.forgotPassword')}</a>} &nbsp;&nbsp;
                            <a href="/help">{t('login.needHelp')}</a>
                        </p>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default LoginForm;
