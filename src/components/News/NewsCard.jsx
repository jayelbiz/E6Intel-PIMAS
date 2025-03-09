import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { formatDistanceToNow } from 'date-fns';
import { NEWS_CATEGORY_LABELS, NEWS_CATEGORY_COLORS } from '@/constants';
import '@/styles/animations.css';

const NewsCard = ({ article, onViewDetails }) => {
    const header = (
        <div className="relative overflow-hidden" id={`news-card-header-${article.id}`}>
            <img 
                src={article.image_url || '/placeholder-news.jpg'} 
                alt={article.title}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                id={`news-image-${article.id}`}
            />
            <div className="absolute bottom-0 start-0 w-100 p-2 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <Tag 
                    value={NEWS_CATEGORY_LABELS[article.category]} 
                    severity={NEWS_CATEGORY_COLORS[article.category]}
                    className="me-2 rounded-lg slide-down font-medium"
                    style={{ animationDelay: '100ms' }}
                    id={`news-category-${article.id}`}
                />
                <span className="text-white font-medium text-sm">{article.source_name}</span>
            </div>
        </div>
    );

    const footer = (
        <div className="flex justify-content-between align-items-center pt-2" id={`news-card-footer-${article.id}`}>
            <span className="text-sm text-600">
                {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
            </span>
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-bookmark"
                    className="p-button-rounded p-button-text p-button-sm hover:bg-primary-50 transition-colors transition-duration-200"
                    tooltip="Bookmark"
                    tooltipOptions={{ position: 'top' }}
                    id={`news-bookmark-btn-${article.id}`}
                />
                <Button 
                    icon="pi pi-external-link"
                    className="p-button-rounded p-button-text p-button-sm hover:bg-primary-50 transition-colors transition-duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(article);
                    }}
                    tooltip="View Details"
                    tooltipOptions={{ position: 'top' }}
                    id={`news-details-btn-${article.id}`}
                />
            </div>
        </div>
    );

    return (
        <Card 
            header={header} 
            footer={footer}
            className="news-card mb-3 theme-transition border-none shadow-2 hover:shadow-4 transition-all transition-duration-300 cursor-pointer"
            onClick={() => onViewDetails(article)}
            id={`news-card-${article.id}`}
            pt={{ content: { className: 'p-3' } }}
        >
            <div className="card-body">
                <h5 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-primary transition-colors duration-200">
                    {article.title}
                </h5>
                <p className="line-clamp-3 text-700 text-sm mb-3">
                    {article.summary || article.content}
                </p>
                {article.news_analysis && (
                    <div className="bg-primary-50 p-2 rounded-lg mt-3">
                        <div className="flex align-items-center mb-2">
                            <i className="pi pi-chart-bar text-primary mr-2"></i>
                            <span className="text-sm font-medium text-primary-900">AI Analysis</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {article.news_analysis.sentiment_score && (
                                <Tag 
                                    value={`Sentiment: ${Math.round(article.news_analysis.sentiment_score * 100)}%`}
                                    severity={article.news_analysis.sentiment_score > 0 ? 'success' : 'danger'}
                                    className="rounded-lg font-medium"
                                    id={`news-sentiment-${article.id}`}
                                />
                            )}
                            {article.news_analysis.bias_indicator && (
                                <Tag 
                                    value={`Bias: ${article.news_analysis.bias_indicator}`}
                                    severity="info"
                                    className="rounded-lg font-medium"
                                    id={`news-bias-${article.id}`}
                                />
                            )}
                            {article.news_analysis.misinformation_flag && (
                                <Tag 
                                    value="Possible Misinformation"
                                    severity="warning"
                                    className="rounded-lg font-medium"
                                    id={`news-factcheck-${article.id}`}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default NewsCard;
