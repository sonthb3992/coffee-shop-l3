import React, { useEffect, useState } from 'react';
import { MenuOption } from '../domain/menu_option';
import MenuOptionComponent from './menu-item';

interface MenuProps {
  chunkSize: number;
  typeFilter: string;
}

const Menu: React.FC<MenuProps> = ({ chunkSize, typeFilter: filter }) => {
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);

  useEffect(() => {
    const fetchMenuOptions = async () => {
      const result = await MenuOption.getAll();
      const filteredResult = result.filter(
        (option) => option.type === filter || filter === ''
      );
      setMenuOptions(filteredResult);
    };

    fetchMenuOptions();
  }, [filter]);

  return (
    <div className="container">
      <div className="columns is-mobile is-multiline">
        {chunkSize === 4 &&
          menuOptions.map((option) => (
            <div
              key={option.nameEn}
              className="column is-half-mobile  is-one-thirds-tablet is-one-quarter-desktop"
            >
              <MenuOptionComponent option={option} />
            </div>
          ))}
        {chunkSize === 3 &&
          menuOptions.map((option) => (
            <div
              key={option.nameEn}
              className="column is-half-mobile  is-one-thirds-tablet"
            >
              <MenuOptionComponent option={option} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Menu;
