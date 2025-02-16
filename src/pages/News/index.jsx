import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import NewsFeed from '../../components/News/NewsFeed';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { CSSTransition } from 'react-transition-group';
import '@styles/animations.css';

const News = () => {
    const navigate = useNavigate();
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);
    const quickViewRef = useRef(null);
    const modalRef = useRef(null);

    const items = [
        { label: 'Home', command: () => navigate('/') },
        { label: 'News' }
    ];

    const handleArticleClick = (article, event) => {
        setSelectedArticle(article);
        setShowQuickView(true);
        quickViewRef.current?.show(event);
    };

    const handleQuickViewClick = () => {
        setShowQuickView(false);
        setTimeout(() => {
            quickViewRef.current?.hide();
            setShowModal(true);
        }, 150);
    };

    const handleModalHide = () => {
        modalRef.current?.classList.add('modal-exit');
        setTimeout(() => {
            setShowModal(false);
            modalRef.current?.classList.remove('modal-exit');
        }, 200);
    };

    const renderQuickView = () => {
        if (!selectedArticle) return null;
        
        return (
            <CSSTransition
                in={showQuickView}
                timeout={150}
                classNames="quick-view"
                unmountOnExit
            >
                <div className="p-3" style={{ width: '400px' }}>
                    <h5 className="slide-down">{selectedArticle.title}</h5>
                    <p className="text-sm text-muted mb-2 slide-down" style={{ animationDelay: '50ms' }}>
                        {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                    </p>
                    <p className="mb-3 slide-down" style={{ animationDelay: '100ms' }}>
                        {selectedArticle.summary}
                    </p>
                    <Button 
                        label="View Full Article" 
                        icon="pi pi-external-link"
                        onClick={handleQuickViewClick}
                        className="slide-up"
                        style={{ animationDelay: '150ms' }}
                    />
                </div>
            </CSSTransition>
        );
    };

    const renderModal = () => {
        if (!selectedArticle) return null;

        return (
            <Dialog
                ref={modalRef}
                header={selectedArticle.title}
                visible={showModal}
                style={{ width: '90vw', maxWidth: '1200px' }}
                modal
                onHide={handleModalHide}
                className="modal-content"
                contentClassName="p-0"
                showHeader={false}
                transitionOptions={{
                    timeout: 300,
                    classNames: {
                        enter: 'modal-enter',
                        enterActive: 'modal-enter-active',
                        exit: 'modal-exit',
                        exitActive: 'modal-exit-active'
                    }
                }}
            >
                <div className="grid m-0">
                    <div className="col-12 p-0">
                        <div className="p-4 border-bottom-1 surface-border slide-down">
                            <h2>{selectedArticle.title}</h2>
                            <p className="text-500 mb-0">
                                {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="col-12 md:col-8 p-4">
                        <img 
                            src={selectedArticle.imageUrl} 
                            alt={selectedArticle.title}
                            className="w-full rounded-lg mb-3 slide-up"
                            style={{ animationDelay: '100ms' }}
                        />
                        <div className="article-content slide-up" style={{ animationDelay: '200ms' }}>
                            {selectedArticle.content}
                        </div>
                    </div>
                    <div className="col-12 md:col-4 p-4">
                        <Card title="Analysis" className="slide-up" style={{ animationDelay: '300ms' }}>
                            <div className="mb-3 slide-up" style={{ animationDelay: '400ms' }}>
                                <h6>Sentiment</h6>
                                <p>{selectedArticle.analysis?.sentiment}</p>
                            </div>
                            <div className="mb-3 slide-up" style={{ animationDelay: '500ms' }}>
                                <h6>Key Themes</h6>
                                <div className="flex flex-wrap gap-2">
                                    {selectedArticle.analysis?.themes.map((theme, i) => (
                                        <span 
                                            key={i} 
                                            className="p-tag slide-up"
                                            style={{ animationDelay: `${600 + (i * 50)}ms` }}
                                        >
                                            {theme}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-3 slide-up" style={{ animationDelay: '700ms' }}>
                                <h6>Related Articles</h6>
                                <ul className="list-none p-0 m-0">
                                    {selectedArticle.relatedArticles?.map((article, i) => (
                                        <li 
                                            key={i} 
                                            className="mb-2 slide-up"
                                            style={{ animationDelay: `${800 + (i * 50)}ms` }}
                                        >
                                            <a 
                                                href="#" 
                                                className="hover:text-primary transition-colors duration-200"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedArticle(article);
                                                }}
                                            >
                                                {article.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    </div>
                </div>
            </Dialog>
        );
    };

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
                                    onClick={() => navigate('/news/bookmarks')}
                                    id="news-bookmark-btn"
                                />
                                <Button
                                    icon="pi pi-bell"
                                    className="btn btn-light btn-sm"
                                    tooltip="Manage Alerts"
                                    tooltipOptions={{ position: 'bottom' }}
                                    onClick={() => navigate('/news/alerts')}
                                    id="news-alerts-btn"
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
                                <NewsFeed onArticleClick={handleArticleClick} />
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
                                onClick={() => navigate('/news/map')}
                                id="news-map-btn"
                            />
                            <Button
                                icon="pi pi-chart-line"
                                label="Analytics"
                                className="btn btn-outline-primary btn-sm waves-effect waves-light"
                                onClick={() => navigate('/news/analytics')}
                                id="news-analytics-btn"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <OverlayPanel 
                ref={quickViewRef} 
                showCloseIcon
                dismissable
                className="quick-view-panel"
                onShow={() => setShowQuickView(true)}
                onHide={() => setShowQuickView(false)}
            >
                {renderQuickView()}
            </OverlayPanel>

            {renderModal()}
        </div>
    );
};

export default News;
