import React, { useRef } from 'react';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import NewsFeed from '../../components/News/NewsFeed';
import { useNavigate } from 'react-router-dom';
import { NEWS_ROUTES } from '../../constants';

const News = () => {
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Breadcrumb configuration
    const items = [
        { label: 'Home', command: () => navigate('/') },
        { label: 'News' }
    ];
    const home = { icon: 'pi pi-home', command: () => navigate('/') };

    // Action menu items
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
        <div className="page-content">
            <div className="container-fluid">
                {/* Page Header */}
                <div className="flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="mb-2">News Intelligence Feed</h4>
                        <BreadCrumb model={items} home={home} className="p-0 text-sm" />
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Button 
                            icon="pi pi-bookmark"
                            className="p-button-outlined"
                            tooltip="View Bookmarks"
                            tooltipOptions={{ position: 'bottom' }}
                            onClick={() => navigate(NEWS_ROUTES.BOOKMARKS)}
                        />
                        <Button
                            icon="pi pi-bell"
                            className="p-button-outlined"
                            tooltip="Manage Alerts"
                            tooltipOptions={{ position: 'bottom' }}
                            onClick={() => navigate(NEWS_ROUTES.ALERTS)}
                        />
                        <Button
                            icon="pi pi-ellipsis-v"
                            className="p-button-outlined"
                            onClick={(e) => menuRef.current?.toggle(e)}
                            aria-controls="news-menu"
                            aria-haspopup
                        />
                        <Menu 
                            ref={menuRef}
                            id="news-menu"
                            model={menuItems} 
                            popup
                        />
                    </div>
                </div>

                {/* News Feed Container */}
                <Card className="shadow-2">
                    <NewsFeed />
                </Card>

                {/* Quick Actions Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-top-1 surface-border p-3 flex justify-content-between align-items-center shadow-2">
                    <div className="flex gap-2">
                        <Button
                            icon="pi pi-refresh"
                            className="p-button-text"
                            tooltip="Refresh Feed"
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                            icon="pi pi-filter"
                            className="p-button-text"
                            tooltip="Quick Filters"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            icon="pi pi-map"
                            label="Map View"
                            className="p-button-outlined"
                            onClick={() => navigate(NEWS_ROUTES.MAP)}
                        />
                        <Button
                            icon="pi pi-chart-line"
                            label="Analytics"
                            className="p-button-outlined"
                            onClick={() => navigate(NEWS_ROUTES.ANALYTICS)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
