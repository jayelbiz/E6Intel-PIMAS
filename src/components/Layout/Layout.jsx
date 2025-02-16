import React from 'react';
import { useAuth } from '@hooks/useAuth';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { auth, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => navigate('/dashboard')
    },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          command: () => navigate('/profile')
        },
        {
          label: 'Sessions',
          icon: 'pi pi-shield',
          command: () => navigate('/profile/sessions')
        },
        {
          separator: true
        },
        {
          label: 'Sign Out',
          icon: 'pi pi-power-off',
          command: handleLogout
        }
      ]
    }
  ];

  // Add admin menu if user has admin role
  if (user?.roles?.includes('admin')) {
    menuItems.push({
      label: 'Admin',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'User Management',
          icon: 'pi pi-users',
          command: () => navigate('/admin/roles')
        }
      ]
    });
  }

  const end = (
    <div className="flex align-items-center gap-2">
      <Avatar
        image={user?.user_metadata?.avatar_url}
        label={user?.email?.[0]?.toUpperCase()}
        shape="circle"
        className="mr-2"
      />
      <Button
        icon="pi pi-power-off"
        onClick={handleLogout}
        severity="secondary"
        text
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-column">
      <Menubar model={menuItems} end={end} className="border-noround" />
      <div className="flex-grow-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
