import React, { useEffect, useState } from 'react';
import { MenuItemTypeOption } from '../domain/menu_option_type';
import Menu from '../components/Menu';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../reducer/store';

const SelectionPage: React.FC = () => {
  const { filter } = useParams();
  const language = useSelector((state: RootState) => state.cart.language);
  const { t } = useTranslation();

  const [menuOptionTypes, setMenuOptionsTypes] = useState<MenuItemTypeOption[]>(
    []
  );
  const [selectedMenuOptionType, setSelectedMenuOptionType] =
    useState<MenuItemTypeOption | null>(null);
  const selectedMenuOptionTypeChanged = (
    selected: MenuItemTypeOption | null
  ) => {
    setSelectedMenuOptionType(selected);
  };

  useEffect(() => {
    const fetchMenuOptionTypes = async () => {
      const result = await MenuItemTypeOption.getAll();
      setMenuOptionsTypes(result);
      if (filter != null) {
        var filtered =
          result.find(
            (type) => type.nameEn.toLowerCase() === filter.toLowerCase()
          ) || null;
        if (filtered) {
          setSelectedMenuOptionType(filtered);
        }
      }
    };
    fetchMenuOptionTypes();
  }, [filter]);

  return (
    <section className="section">
      <div className="container">
        <div className="tabs is-fullwidth">
          <ul>
            <li className={selectedMenuOptionType === null ? 'is-active' : ''}>
              <button
                className={`button is-fullwidth ${
                  selectedMenuOptionType === null ? 'is-primary' : 'is-white'
                }`}
                onClick={() => selectedMenuOptionTypeChanged(null)}
              >
                {t('All items')}
              </button>
            </li>
            {menuOptionTypes?.length! > 0 &&
              menuOptionTypes?.map((e) => (
                <li key={e.nameEn}>
                  <button
                    className={`button is-fullwidth ${
                      selectedMenuOptionType?.nameEn === e.nameEn
                        ? 'is-primary'
                        : 'is-white'
                    }`}
                    onClick={() => selectedMenuOptionTypeChanged(e)}
                  >
                    {language === 'en' ? e.nameEn : e.nameVi}
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <Menu chunkSize={4} typeFilter={selectedMenuOptionType?.nameEn ?? ''} />
      </div>
    </section>
  );
};

export default SelectionPage;
