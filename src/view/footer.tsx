import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducer/store";
import { setLanguage } from "../reducer/cartSlice";

const Footer = () => {
    const language = useSelector((state: RootState) => state.cart.language);
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const lngs = [
        { code: "en", native: "En" },
        { code: "vn", native: "Vi" },
    ];
    const handleTrans = (code: string) => {
        i18n.changeLanguage(code);
        dispatch(setLanguage(code));
    };

    return (
        <footer className="footer">
            <div className="footer-body">
                <div className="level">
                    <div className="level-left">
                        <p>
                            <strong>Uncle & Aunt Coffee shop</strong> by <strong>team 7</strong>. The source code can be found <a href="https://github.com/sonthb3992/coffee-shop-l3">here</a>.
                        </p>
                    </div>
                    <div className="level-right">
                        <span className="icon-text is-flex is-align-content-center	is-align-items-center">
                            <span className="icon">
                                <i className="fa-solid fa-globe"></i>
                            </span>
                            <span>
                                <div className="dropdown is-small is-right is-up is-hoverable">
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span>{language === "vi" ? 'Vietnameses' : 'English'}</span>
                                            <span className="icon">
                                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <a className="dropdown-item" onClick={() => handleTrans("vi")}>
                                                Vietnamese
                                            </a>
                                            <a className="dropdown-item" onClick={() => handleTrans("en")}>
                                                English
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </span>

                    </div>
                </div>

            </div>
        </footer>

    );
};

export default Footer;