import React from 'react';
import { Outlet } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';

const MainLayout = () => {
  const menuItems = [
    {
      label: 'News',
      icon: 'pi pi-fw pi-file',
      url: '/'
    },
    {
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      url: '/settings'
    }
  ];

  return (
    <div className="layout-wrapper">
      <Menubar model={menuItems} />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
