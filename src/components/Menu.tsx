import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { fetchMenuItems } from '../reducer/menuItems';
import { useAppDispatch } from '../reducer/hook';
import { Item } from '../models/Item';
import ItemComponent from './Item';

interface MenuProps {
  chunkSize: number;
  typeFilter: string;
}

const MenuComponent: React.FC<MenuProps> = ({
  chunkSize,
  typeFilter: filter,
}) => {
  const menuItems = useSelector(
    (state: RootState) => state.menuItems.menuItems
  );
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(fetchMenuItems());
  }, [appDispatch, filter]);

  return (
    <div className="container">
      <div className="columns is-mobile is-multiline">
        {chunkSize === 4 &&
          menuItems.map((item: Item) => (
            <div
              key={item.name}
              className="column is-half-mobile is-one-thirds-tablet is-one-quarter-desktop"
            >
              <ItemComponent item={item} />
            </div>
          ))}
        {chunkSize === 3 &&
          menuItems.map((item: Item) => (
            <div
              key={item.name}
              className="column is-half-mobile is-one-thirds-tablet"
            >
              <ItemComponent item={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MenuComponent;
