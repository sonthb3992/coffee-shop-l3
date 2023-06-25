import React from 'react';
import CreateItemForm from '../components/createItemForm';
import Menu from '../components/Menu';

const MenuManagementPage: React.FC = () => {
  return (
    <div>
      <section className="section p-0">
        <Menu chunkSize={4} typeFilter="" />
        <CreateItemForm />
      </section>
    </div>
  );
};

export default MenuManagementPage;
