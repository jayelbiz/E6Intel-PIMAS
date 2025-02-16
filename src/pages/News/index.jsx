import React, { useRef } from 'react';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import NewsFeed from '@components/News/NewsFeed';
import { useNavigate } from 'react-router-dom';
import { NEWS_ROUTES } from '@/constants';

const News = () => {
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const items = [
        { label: 'Home', command: () => navigate('/') },
        { label: 'News' }
    ];
    const home = { icon: 'pi pi-home', command: () => navigate('/') };

    const menuItems = [
        {
            label: 'View Bookmarks',
            icon: 'pi pi-bookmark',
            command: () => navigate(NEWS_ROUTES.BOOKMARKS)
        },
        {
            label: 'Manage Alerts',
            icon: 'pi pi-bell',
            command: () => navigate(NEWS_ROUTES.ALERTS)
        },
        {
            separator: true
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => navigate(NEWS_ROUTES.SETTINGS)
        }
    ];

    return (
        <div className="page-content" id="news-page-content">
            <div className="container-fluid">
                {/* Page Header */}
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <div>
                                <h4 className="mb-0 font-size-18">News Intelligence Feed</h4>
                                <BreadCrumb 
                                    model={items} 
                                    home={home} 
                                    className="mt-2"
                                    id="news-breadcrumb"
                                />
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <Button 
                                    icon="pi pi-bookmark"
                                    className="btn btn-light btn-sm"
                                    tooltip="View Bookmarks"
                                    tooltipOptions={{ position: 'bottom' }}
                                    onClick={() => navigate(NEWS_ROUTES.BOOKMARKS)}
                                    id="news-bookmark-btn"
                                />
                                <Button
                                    icon="pi pi-bell"
                                    className="btn btn-light btn-sm"
                                    tooltip="Manage Alerts"
                                    tooltipOptions={{ position: 'bottom' }}
                                    onClick={() => navigate(NEWS_ROUTES.ALERTS)}
                                    id="news-alerts-btn"
                                />
                                <Button
                                    icon="pi pi-ellipsis-v"
                                    className="btn btn-light btn-sm"
                                    onClick={(e) => menuRef.current?.toggle(e)}
                                    aria-controls="news-actions-menu"
                                    aria-haspopup
                                    id="news-menu-btn"
                                />
                                <Menu 
                                    ref={menuRef}
                                    id="news-actions-menu"
                                    model={menuItems} 
                                    popup
                                    className="shadow-3"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* News Feed Container */}
                <div className="row">
                    <div className="col-12">
                        <div className="card" id="news-feed-container">
                            <div className="card-body">
                                <NewsFeed />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Footer */}
                <div className="row position-fixed bottom-0 start-0 w-100 bg-white border-top py-2 px-3 shadow-lg" id="news-quick-actions">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                            <Button
                                icon="pi pi-refresh"
                                className="btn btn-soft-primary btn-sm"
                                tooltip="Refresh Feed"
                                tooltipOptions={{ position: 'top' }}
                                id="news-refresh-btn"
                            />
                            <Button
                                icon="pi pi-filter"
                                className="btn btn-soft-primary btn-sm"
                                tooltip="Quick Filters"
                                tooltipOptions={{ position: 'top' }}
                                id="news-filter-btn"
                            />
                        </div>
                        <div className="d-flex gap-2">
                            <Button
                                icon="pi pi-map"
                                label="Map View"
                                className="btn btn-outline-primary btn-sm waves-effect waves-light"
                                onClick={() => navigate(NEWS_ROUTES.MAP)}
                                id="news-map-btn"
                            />
                            <Button
                                icon="pi pi-chart-line"
                                label="Analytics"
                                className="btn btn-outline-primary btn-sm waves-effect waves-light"
                                onClick={() => navigate(NEWS_ROUTES.ANALYTICS)}
                                id="news-analytics-btn"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
