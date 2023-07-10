import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../reducer/hook';
import { setTable } from '../reducer/cartSlice';

const TableOrderSelectionPage: React.FC = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const appDispath = useAppDispatch();

  useEffect(() => {
    if (tableId) {
      appDispath(setTable(tableId));
      navigate("/all-items");
    } else {
      navigate("/404")
    }
  });

  return (
    <></>
  );
};

export default TableOrderSelectionPage;
