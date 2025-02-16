import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { useAuth } from '@hooks/useAuth';
import { useNews } from '@contexts/NewsContext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';

const GlobalNavbar = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { unreadCount, latestArticles, markArticleAsRead } = useNews();
    const newsOverlayRef = useRef(null);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const handleNewsClick = (e) => {
        newsOverlayRef.current.toggle(e);
    };

    const handleArticleClick = (article) => {
        markArticleAsRead(article.id);
        navigate(`/news/${article.id}`);
        newsOverlayRef.current.hide();
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
                                    <Button
                                        className="nav-link"
                                        onClick={handleNewsClick}
                                    >
                                        <i className="bx bx-news me-2"></i>
                                        <span>News</span>
                                        {unreadCount > 0 && (
                                            <Badge 
                                                value={unreadCount} 
                                                className="ms-1" 
                                                severity="danger"
                                            ></Badge>
                                        )}
                                    </Button>
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

            {/* News Quick View Panel */}
            <OverlayPanel 
                ref={newsOverlayRef} 
                className="news-overlay"
                showCloseIcon
            >
                <div className="p-3" style={{ width: '350px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="m-0">Latest News</h5>
                        <Link 
                            to="/news" 
                            className="btn btn-link p-0"
                            onClick={() => newsOverlayRef.current.hide()}
                        >
                            View All
                        </Link>
                    </div>
                    <div className="news-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {latestArticles.map(article => (
                            <div 
                                key={article.id}
                                className="news-item p-2 mb-2 border-bottom cursor-pointer hover-lift"
                                onClick={() => handleArticleClick(article)}
                            >
                                <div className="d-flex align-items-start">
                                    {article.image_url && (
                                        <img 
                                            src={article.image_url} 
                                            alt="" 
                                            className="me-2" 
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div>
                                        <h6 className="mb-1 text-truncate" style={{ maxWidth: '250px' }}>
                                            {article.title}
                                        </h6>
                                        <small className="text-muted">
                                            {new Date(article.published_at).toLocaleString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </OverlayPanel>

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
