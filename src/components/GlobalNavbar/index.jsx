import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { useAuth } from '@hooks/useAuth';

const GlobalNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="navbar-header">
            {/* Left side */}
            <div className="d-flex align-items-center">
                {/* Logo */}
                <div className="navbar-brand-box">
                    <Link to="/" className="logo">
                        <span className="logo-sm">
                            <img src="/logo-sm.png" alt="" height="22" />
                        </span>
                        <span className="logo-lg">
                            <img src="/logo-dark.png" alt="" height="17" />
                        </span>
                    </Link>
                </div>

                {/* Toggle Button */}
                <Button 
                    icon="pi pi-bars"
                    className="btn header-item"
                    onClick={() => document.body.classList.toggle('sidebar-enable')}
                />

                {/* Main Navigation */}
                <div className="d-none d-lg-flex align-items-center">
                    <Link 
                        to="/map" 
                        className={`nav-link px-3 ${location.pathname === '/map' ? 'active' : ''}`}
                    >
                        <i className="bx bx-map me-2"></i>
                        Map
                    </Link>

                    <Link 
                        to="/analysis" 
                        className={`nav-link px-3 ${location.pathname === '/analysis' ? 'active' : ''}`}
                    >
                        <i className="bx bx-analyse me-2"></i>
                        Analysis
                    </Link>
                </div>
            </div>

            {/* Right side */}
            <div className="d-flex align-items-center">
                {/* Search */}
                <Button 
                    icon="pi pi-search"
                    className="header-item noti-icon p-link"
                    onClick={() => navigate('/search')}
                />

                {/* Notifications */}
                <Button
                    icon="pi pi-bell"
                    badge="3"
                    className="header-item noti-icon p-link"
                    badgeClassName="p-badge-danger"
                    onClick={() => navigate('/notifications')}
                />

                {/* User Profile */}
                <div className="dropdown">
                    <Button
                        className="header-item user-dropdown p-link"
                        onClick={() => navigate('/profile')}
                    >
                        <Avatar 
                            image={user?.avatar_url || "/avatar-placeholder.png"}
                            shape="circle"
                            className="me-2"
                        />
                        <span className="d-none d-xl-inline-block ms-1">
                            {user?.name}
                        </span>
                        <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                    </Button>
                </div>

                {/* Settings */}
                <Button
                    icon="pi pi-cog"
                    className="header-item noti-icon p-link"
                    onClick={() => navigate('/settings')}
                />
            </div>
        </div>
    );
};

export default GlobalNavbar;
