import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card } from 'primereact/card';

const AuthLayout = () => {
  return (
    <div className="layout-wrapper surface-ground">
      <div className="flex align-items-center justify-content-center min-h-screen">
        <Card className="w-full md:w-6 lg:w-4">
          <Outlet />
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
