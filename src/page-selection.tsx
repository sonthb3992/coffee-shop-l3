import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MenuOption } from './domain/menu_option';
import QuantitySelector from './view/quanlity-selector';
import { StyleOption } from './domain/option_stype';
import { SizeOption } from './domain/option_size';
import { OrderItem } from './domain/selected_item';
import { ToppingOption } from './domain/option_topping';
import { MenuItemTypeOption } from './domain/menu_option_type';
import Menu from './view/menu';


const SelectionPage: React.FC = () => {
    const [menuOptionTypes, setMenuOptionsTypes] = useState<MenuItemTypeOption[]>([]);

    const [selectedMenuOptionType, setSelectedMenuOptionType] = useState<MenuItemTypeOption | null>(null);

    const selectedMenuOptionTypeChanged = (selected: MenuItemTypeOption | null) => {
        setSelectedMenuOptionType(selected);
    }

    useEffect(() => {
        const fetchMenuOptionTypes = async () => {
            const result = await MenuItemTypeOption.getAll();
            setMenuOptionsTypes(result);
        };
        fetchMenuOptionTypes();
    }, []);

    return (
        <section className='section'>
            <div className='container'>
                <nav className="breadcrumb" aria-label="breadcrumbs">
                    <ul>
                        <li><a href="#" className='has-text-weight-semibold'>Menu</a></li>
                        <li><a href="#" className='has-text-weight-semibold is-active'>{selectedMenuOptionType?.nameEn ?? "All items"}</a></li>
                        {/* <li className="is-active has-text-weight-semibold"><a href="#" aria-current="page">{menuOption?.nameEn}</a></li> */}
                    </ul>
                </nav>

                <div className='columns is-desktop'>
                    <div className='column is-one-quarter'>
                        <aside className="menu">
                            <ul className="menu-list">
                                <li className='block'>
                                    <button className={`m-3 is-fullwidth is-white button ${!selectedMenuOptionType ? 'is-primary' : ''}`} onClick={() => selectedMenuOptionTypeChanged(null)}>All items</button>
                                </li>
                                {(menuOptionTypes?.length! > 0) && (
                                    <li className='block'>
                                        {menuOptionTypes?.map((e) =>
                                            <button key={e.nameEn} className={`m-3 is-fullwidth is-white button ${e.nameEn === selectedMenuOptionType?.nameEn ? 'is-primary' : ''}`} onClick={() => selectedMenuOptionTypeChanged(e)}>{e.nameEn}</button>
                                        )}
                                    </li>
                                )}
                            </ul>
                        </aside>
                    </div>
                    <div className='column is-three-quarter ml-6 mt-3'>
                        <Menu chunkSize={3} typeFilter={selectedMenuOptionType?.nameEn ?? ''}></Menu>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default SelectionPage;
