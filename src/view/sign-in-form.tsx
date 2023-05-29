import React from 'react';
import { useTranslation } from 'react-i18next';

const SignInForm: React.FC = () => {
    const { t } = useTranslation();
    return (
        <form>
            <div className="field">
                <div className="control">
                    <input className="input" type="email" autoFocus placeholder={t('login.emailPlaceholder').toString()} />
                </div>
            </div>

            <div className="field">
                <div className="control">
                    <input className="input" type="password" placeholder={t('login.passwordPlaceholder').toString()} />
                </div>
            </div>
            <div className="field">
                <label className="checkbox">
                    <input type="checkbox" /> {t('login.rememberMe')}
                </label>
            </div>
            <button className="button is-block is-info is-fullwidth">
                {t('login.loginButton')} <i className="fa fa-sign-in" aria-hidden="true" />
            </button>
        </form>
    );
}

export default SignInForm;