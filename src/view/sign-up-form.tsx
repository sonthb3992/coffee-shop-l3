import React from 'react';
import { useTranslation } from 'react-i18next';

const SignUpForm: React.FC = () => {
    const { t } = useTranslation();
    return (
        <form>
            <div className="field">
                <div className="control">
                    <input className="input" type="text" autoFocus placeholder={t('signup.namePlaceholder').toString()} />
                </div>
            </div>
            <div className="field">
                <div className="control">
                    <input className="input" type="email" placeholder={t('signup.emailPlaceholder').toString()} />
                </div>
            </div>
            <div className="field">
                <div className="control">
                    <input className="input" type="password" placeholder={t('signup.passwordPlaceholder').toString()} />
                </div>
            </div>
            <div className="field">
                <div className="control">
                    <input className="input" type="password" placeholder={t('signup.confirmPasswordPlaceholder').toString()} />
                </div>
            </div>
            <button className="button is-block is-info is-fullwidth">
                {t('signup.signupButton')} <i className="fa fa-user-plus" aria-hidden="true" />
            </button>
        </form>
    );
}

export default SignUpForm;