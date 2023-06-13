import React, { useEffect } from 'react';
import MenuOptionComponent from './menu-item';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { fetchMenuItems } from '../reducer/menu-option-slice';
import { useAppDispatch } from '../reducer/hook';

interface MenuProps {
  chunkSize: number;
  typeFilter: string;
}

const Menu: React.FC<MenuProps> = ({ chunkSize, typeFilter: filter }) => {
  // const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
  const menuOptions = useSelector(
    (state: RootState) => state.menuOptions.menuItems
  );

  const appDispath = useAppDispatch();

  useEffect(() => {
    appDispath(fetchMenuItems());
  }, [filter]);

  return (
    <div className="container">
      <div className="columns is-mobile is-multiline">
        {chunkSize === 4 &&
          menuOptions.map((option) => (
            <div
              key={option.nameEn}
              className="column is-half-mobile is-one-thirds-tablet is-one-quarter-desktop"
            >
              <MenuOptionComponent option={option} />
            </div>
          ))}
        {chunkSize === 3 &&
          menuOptions.map((option) => (
            <div
              key={option.nameEn}
              className="column is-half-mobile is-one-thirds-tablet"
            >
              <MenuOptionComponent option={option} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Menu;
