import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useAuth } from '../hooks/useAuth';

const VerticalLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      command: () => navigate('/dashboard')
    },
    {
      label: 'News',
      icon: 'pi pi-fw pi-globe',
      items: [
        {
          label: 'All News',
          icon: 'pi pi-fw pi-list',
          command: () => navigate('/news')
        },
        {
          label: 'Categories',
          icon: 'pi pi-fw pi-tags',
          command: () => navigate('/news/categories')
        }
      ]
    },
    {
      label: 'Analysis',
      icon: 'pi pi-fw pi-chart-bar',
      command: () => navigate('/analysis')
    },
    {
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: 'Profile',
          icon: 'pi pi-fw pi-user',
          command: () => navigate('/profile')
        },
        {
          label: 'Preferences',
          icon: 'pi pi-fw pi-sliders-h',
          command: () => navigate('/preferences')
        }
      ]
    }
  ];

  const endTemplate = () => {
    return (
      <div className="flex align-items-center gap-2">
        <span className="text-sm">{user?.email}</span>
        <Button
          icon="pi pi-power-off"
          severity="secondary"
          outlined
          loading={loading}
          onClick={handleSignOut}
          tooltip="Sign Out"
          tooltipOptions={{ position: 'bottom' }}
        />
      </div>
    );
  };

  return (
    <div className="layout-wrapper">
      <Menubar
        model={menuItems}
        end={endTemplate}
        className="layout-topbar shadow-2"
      />
      <div className="layout-main-container">
        <div className="layout-main">
          {children}
        </div>
      </div>
    </div>
  );
};

VerticalLayout.propTypes = {
  children: PropTypes.node
};

export default VerticalLayout;
