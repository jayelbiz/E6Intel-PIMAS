import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Container } from 'reactstrap';

const Layout = ({ children }) => {
  const { auth, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="layout-wrapper">
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light">
        <Container fluid>
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <img src="/logo-sm.png" alt="logo" height="22" />
          </Link>

          {/* Main Navigation */}
          <div className="d-flex align-items-center">
            <Link 
              to="/dashboard" 
              className={`nav-link px-3 ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              <i className="bx bx-home me-2"></i>
              Dashboard
            </Link>

            <Link 
              to="/profile" 
              className={`nav-link px-3 ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              <i className="bx bx-user me-2"></i>
              Profile
            </Link>

            {user?.roles?.includes('admin') && (
              <Link 
                to="/admin/roles" 
                className={`nav-link px-3 ${location.pathname === '/admin/roles' ? 'active' : ''}`}
              >
                <i className="bx bx-cog me-2"></i>
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center ms-3">
              <Avatar 
                image={user?.user_metadata?.avatar_url} 
                shape="circle" 
                size="small"
                className="me-2" 
              />
              <span className="fw-medium d-none d-md-inline">{user?.email}</span>
              <Button
                icon="pi pi-power-off"
                rounded
                text
                severity="secondary"
                onClick={handleLogout}
                className="ms-2"
                tooltip="Sign Out"
              />
            </div>
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

export default Layout;
