import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { formatDistanceToNow } from 'date-fns';
import '@/styles/animations.css';

const NewsModal = ({ article, visible, onHide }) => {
    if (!article) return null;

    const header = (
        <div className="flex flex-column md:flex-row md:align-items-center gap-2 w-full">
            <div className="flex align-items-center gap-2 flex-1">
                <span className="text-xl font-bold">{article.source_name}</span>
                <Tag 
                    value={article.category.replace('_', ' ')} 
                    severity={article.category === 'security_alerts' ? 'danger' : 'info'}
                    className="capitalize py-1 px-2"
                />
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
                <Button 
                    icon="pi pi-bookmark"
                    className="p-button-rounded p-button-text hover:bg-primary-50 transition-colors transition-duration-200"
                    tooltip="Bookmark Article"
                    tooltipOptions={{ position: 'bottom' }}
                    aria-label="Bookmark Article"
                />
                <Button 
                    icon="pi pi-share-alt"
                    className="p-button-rounded p-button-text hover:bg-primary-50 transition-colors transition-duration-200"
                    tooltip="Share Article"
                    tooltipOptions={{ position: 'bottom' }}
                    aria-label="Share Article"
                />
            </div>
        </div>
    );

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button 
                label="Close" 
                icon="pi pi-times" 
                onClick={onHide} 
                text
                className="hover:bg-primary-50 transition-colors transition-duration-200"
            />
            <Button 
                label="Visit Source" 
                icon="pi pi-external-link" 
                onClick={() => window.open(article.url, '_blank')}
                className="p-button-raised transition-shadow transition-duration-200 hover:shadow-4"
            />
        </div>
    );

    return (
        <Dialog
            header={header}
            visible={visible}
            onHide={onHide}
            footer={footer}
            style={{ width: '95%', maxWidth: '800px' }}
            modal
            className="news-modal p-fluid shadow-8 animate-modal"
            showHeader={true}
            breakpoints={{ '960px': '95vw' }}
            transitionOptions={{
                timeout: 300, 
                classNames: {
                    enter: 'animate__animated animate__fadeIn animate__faster',
                    exit: 'animate__animated animate__fadeOut animate__faster'
                }
            }}
            blockScroll
            closeOnEscape
            dismissableMask
            pt={{
                root: { className: 'border-round-xl overflow-hidden' },
                content: { className: 'px-3 py-4 md:px-4 md:py-5' },
                footer: { className: 'py-3 px-3 md:px-4' },
                headerTitle: { className: 'w-full' },
                header: { className: 'border-bottom-1 border-300 py-3' }
            }}
        >
            <div className="grid">
                <div className="col-12">
                    <img 
                        src={article.image_url || '/placeholder-news.jpg'} 
                        alt={article.title}
                        className="w-full max-h-24rem object-cover mb-4 border-round-lg shadow-3 transition-transform transition-duration-200 hover:shadow-5"
                        onError={(e) => e.target.src = '/placeholder-news.jpg'}
                    />
                </div>
                
                <div className="col-12">
                    <h2 className="text-2xl font-bold mb-3 text-900">{article.title}</h2>
                    <p className="text-sm text-500 mb-4 flex align-items-center">
                        <i className="pi pi-calendar-plus mr-2"></i>
                        Published {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                    </p>
                    
                    {article.news_analysis && (
                        <div className="mb-4 p-3 surface-ground border-round-lg shadow-2 animate-modal-content" style={{animationDelay: '200ms'}}>
                            <h3 className="text-lg font-semibold mb-3 flex align-items-center">
                                <i className="pi pi-chart-bar mr-2 text-primary"></i>
                                AI Analysis
                            </h3>
                            <div className="grid">
                                <div className="col-12 md:col-4">
                                    <div className="mb-3">
                                        <span className="font-semibold block mb-2 text-700">Sentiment</span>
                                        <Tag 
                                            value={`${Math.round(article.news_analysis.sentiment_score * 100)}%`}
                                            severity={article.news_analysis.sentiment_score > 0 ? 'success' : 'danger'}
                                            className="py-1 px-2"
                                        />
                                    </div>
                                </div>
                                <div className="col-12 md:col-4">
                                    <div className="mb-3">
                                        <span className="font-semibold block mb-2 text-700">Bias</span>
                                        <Tag 
                                            value={article.news_analysis.bias_indicator}
                                            severity="info"
                                            className="py-1 px-2 capitalize"
                                        />
                                    </div>
                                </div>
                                <div className="col-12 md:col-4">
                                    <div className="mb-3">
                                        <span className="font-semibold block mb-2 text-700">Verification</span>
                                        <Tag 
                                            value={article.news_analysis.misinformation_flag ? 'Needs Verification' : 'Verified'}
                                            severity={article.news_analysis.misinformation_flag ? 'warning' : 'success'}
                                            className="py-1 px-2"
                                        />
                                    </div>
                                </div>
                                {article.news_analysis.key_themes && (
                                    <div className="col-12 animate-modal-content" style={{animationDelay: '300ms'}}>
                                        <span className="font-semibold block mb-2 text-700">Key Themes</span>
                                        <div className="flex gap-2 flex-wrap">
                                            {article.news_analysis.key_themes.map((theme, index) => (
                                                <Tag 
                                                    key={index} 
                                                    value={theme} 
                                                    className="py-1 px-2 capitalize"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <div className="text-color-secondary whitespace-pre-line text-base leading-relaxed mt-4 animate-modal-content" style={{animationDelay: '400ms'}}>
                        {article.content}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default NewsModal;
