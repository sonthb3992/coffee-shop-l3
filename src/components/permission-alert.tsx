import React from 'react';

const PermissionAlertComponent: React.FC = () => {
  return (
    <section className="hero is-fullheight ">
      <div className="hero-body has-text-centered">
        <div className="container">
          <span className="icon has-text-warning is-size-1">
            <i className="fas fa-exclamation-triangle"></i>
          </span>
          <p className="title pt-3">Permission alert</p>
          <p className="subtitle pt-1">
            You do not have the permission to view this page
          </p>
        </div>
      </div>
    </section>
  );
};

export default PermissionAlertComponent;
