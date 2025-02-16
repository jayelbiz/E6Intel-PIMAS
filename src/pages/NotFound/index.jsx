import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <div className="text-center">
        <h1 className="text-900 font-bold text-8xl mb-4">404</h1>
        <p className="text-600 mb-4">The page you requested was not found</p>
        <Button 
          label="Go Home" 
          icon="pi pi-home" 
          onClick={() => navigate('/')} 
        />
      </div>
    </div>
  );
};

export default NotFound;
