import React, { useEffect, useState } from 'react';
import { MenuItemTypeOption } from '../domain/menu_option_type';
import Menu from '../view/menu';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../reducer/store';


const SelectionPage: React.FC = () => {
    const { filter } = useParams();
    const language = useSelector((state: RootState) => state.cart.language);
    const { t } = useTranslation();

    const [menuOptionTypes, setMenuOptionsTypes] = useState<MenuItemTypeOption[]>([]);
    const [selectedMenuOptionType, setSelectedMenuOptionType] = useState<MenuItemTypeOption | null>(null);
    const selectedMenuOptionTypeChanged = (selected: MenuItemTypeOption | null) => {
        setSelectedMenuOptionType(selected);
    }

    useEffect(() => {
        const fetchMenuOptionTypes = async () => {
            const result = await MenuItemTypeOption.getAll();
            setMenuOptionsTypes(result);
            if (filter != null) {
                var filtered = result.find((type) => type.nameEn.toLowerCase() == filter.toLowerCase()) || null;
                if (filtered) {
                    setSelectedMenuOptionType(filtered);
                }
            }
        };
        fetchMenuOptionTypes();
    }, [filter]);

    return (
        <section className='section'>
            <div className='container'>
                <div className="tabs is-toggle is-fullwidth">
                    <ul>
                        <li className={selectedMenuOptionType === null ? 'is-active' : ''}><a onClick={() => selectedMenuOptionTypeChanged(null)}>{t('All items')}</a></li>
                        {menuOptionTypes?.length! > 0 && menuOptionTypes?.map((e) =>
                            <li key={e.nameEn} className={e.nameEn === selectedMenuOptionType?.nameEn ? 'is-active is-primary' : ''}>
                                <a onClick={() => selectedMenuOptionTypeChanged(e)}>{language === "en" ? e.nameEn : e.nameVi}</a>
                            </li>
                        )}
                    </ul>
                </div>
                <Menu chunkSize={4} typeFilter={selectedMenuOptionType?.nameEn ?? ''} />
            </div >
        </section >
    );
};

export default SelectionPage;
