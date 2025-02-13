import React from 'react';
import PropTypes from 'prop-types';

const NonAuthLayout = ({ children }) => {
  return (
    <div className="auth-page-wrapper pt-5">
      <div className="auth-page-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

NonAuthLayout.propTypes = {
  children: PropTypes.node
};

export default NonAuthLayout;
