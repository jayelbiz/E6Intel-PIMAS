import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { useAuth } from '@hooks/useAuth';

const GlobalNavbar = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="navbar-header">
            {/* Left side */}
            <div className="d-flex">
                {/* Logo */}
                <div className="navbar-brand-box">
                    <Link to="/" className="logo">
                        <span className="logo-sm">
                            <img src="/logo-sm.png" alt="" height="22" />
                        </span>
                        <span className="logo-lg d-none d-lg-block">
                            <img src="/logo-dark.png" alt="" height="17" />
                        </span>
                    </Link>
                </div>

                {/* Main Navigation */}
                <div className="topnav">
                    <nav className="navbar navbar-light navbar-expand-lg topnav-menu">
                        <div className="collapse navbar-collapse" id="topnav-menu-content">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link to="/news" className="nav-link">
                                        <i className="bx bx-news me-2"></i>
                                        <span>News</span>
                                        <Badge value="5" className="ms-1" severity="danger"></Badge>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/map" className="nav-link">
                                        <i className="bx bx-map me-2"></i>
                                        <span>Map</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/analysis" className="nav-link">
                                        <i className="bx bx-analyse me-2"></i>
                                        <span>Analysis</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Right side */}
            <div className="d-flex align-items-center">
                {/* Search */}
                <div className="dropdown d-inline-block d-lg-none ms-2">
                    <Button 
                        icon="pi pi-search"
                        className="header-item noti-icon"
                        onClick={() => navigate('/search')}
                    />
                </div>

                {/* Notifications */}
                <div className="dropdown d-inline-block">
                    <Button
                        icon="pi pi-bell"
                        badge="3"
                        className="header-item noti-icon"
                        badgeClassName="bg-danger"
                        onClick={() => navigate('/notifications')}
                    />
                </div>

                {/* User Profile */}
                <div className="dropdown d-inline-block">
                    <Button
                        className="header-item"
                        onClick={() => navigate('/profile')}
                    >
                        <Avatar 
                            image={user?.avatar_url || "/avatar-placeholder.png"}
                            shape="circle"
                            className="header-profile-user"
                        />
                        <span className="d-none d-xl-inline-block ms-1 fw-medium font-size-15">
                            {user?.name}
                        </span>
                    </Button>
                </div>

                {/* Settings */}
                <div className="dropdown d-inline-block">
                    <Button
                        icon="pi pi-cog"
                        className="header-item noti-icon right-bar-toggle"
                        onClick={() => navigate('/settings')}
                    />
                </div>
            </div>
        </div>
    );
};

export default GlobalNavbar;
