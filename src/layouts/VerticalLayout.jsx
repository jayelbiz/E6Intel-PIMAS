import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Button } from 'primereact/button';
import { useAuth } from '../hooks/useAuth';

const VerticalLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Container fluid>
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <img src="/logo-sm.png" alt="logo" height="22" />
          </Link>

          {/* Navigation Links */}
          <div className="navbar-nav mr-auto">
            <Link 
              to="/news" 
              className={`nav-item nav-link ${location.pathname === '/news' ? 'active' : ''}`}
            >
              <i className="bx bx-news me-2"></i>
              News
            </Link>

            <Link 
              to="/map" 
              className={`nav-item nav-link ${location.pathname === '/map' ? 'active' : ''}`}
            >
              <i className="bx bx-map me-2"></i>
              Map
            </Link>

            <Link 
              to="/analysis" 
              className={`nav-item nav-link ${location.pathname === '/analysis' ? 'active' : ''}`}
            >
              <i className="bx bx-analyse me-2"></i>
              Analysis
            </Link>
          </div>
        </Container>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <Container fluid>
          {children}
        </Container>
      </div>
    </div>
  );
};

VerticalLayout.propTypes = {
  children: PropTypes.node
};

export default VerticalLayout;
