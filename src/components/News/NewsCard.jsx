import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { formatDistanceToNow } from 'date-fns';
import { NEWS_CATEGORY_LABELS, NEWS_CATEGORY_COLORS } from '../../constants';

const NewsCard = ({ article, onViewDetails }) => {
    const header = (
        <div className="position-relative" id={`news-card-header-${article.id}`}>
            <img 
                src={article.image_url || '/placeholder-news.jpg'} 
                alt={article.title}
                className="card-img-top"
                style={{ height: '160px', objectFit: 'cover' }}
                id={`news-image-${article.id}`}
            />
            <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <Tag 
                    value={NEWS_CATEGORY_LABELS[article.category]} 
                    severity={NEWS_CATEGORY_COLORS[article.category]}
                    className="me-2 rounded"
                    id={`news-category-${article.id}`}
                />
                <span className="text-white font-size-13">{article.source_name}</span>
            </div>
        </div>
    );

    const footer = (
        <div className="d-flex justify-content-between align-items-center" id={`news-card-footer-${article.id}`}>
            <span className="text-muted font-size-13">
                {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
            </span>
            <div className="d-flex gap-2">
                <Button 
                    icon="pi pi-bookmark"
                    className="btn btn-soft-secondary btn-sm p-button-rounded"
                    tooltip="Bookmark"
                    tooltipOptions={{ position: 'top' }}
                    id={`news-bookmark-btn-${article.id}`}
                />
                <Button 
                    icon="pi pi-external-link"
                    className="btn btn-soft-primary btn-sm p-button-rounded"
                    tooltip="View Details"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => onViewDetails(article)}
                    id={`news-details-btn-${article.id}`}
                />
            </div>
        </div>
    );

    return (
        <Card 
            header={header} 
            footer={footer}
            className="mb-3 shadow-none border"
            onClick={() => onViewDetails(article)}
            id={`news-card-${article.id}`}
        >
            <div className="card-body p-3">
                <h5 className="card-title font-size-16 mb-2 text-truncate-2">
                    {article.title}
                </h5>
                <p className="card-text text-muted mb-3 text-truncate-3">
                    {article.summary || article.content}
                </p>
                {article.news_analysis && (
                    <div className="bg-light p-2 rounded">
                        <div className="d-flex align-items-center mb-2">
                            <i className="bx bx-chart text-primary me-2"></i>
                            <span className="font-size-14 fw-medium">AI Analysis</span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {article.news_analysis.sentiment_score && (
                                <Tag 
                                    value={`Sentiment: ${Math.round(article.news_analysis.sentiment_score * 100)}%`}
                                    severity={article.news_analysis.sentiment_score > 0 ? 'success' : 'danger'}
                                    className="rounded-pill"
                                    id={`news-sentiment-${article.id}`}
                                />
                            )}
                            {article.news_analysis.bias_indicator && (
                                <Tag 
                                    value={`Bias: ${article.news_analysis.bias_indicator}`}
                                    severity="info"
                                    className="rounded-pill"
                                    id={`news-bias-${article.id}`}
                                />
                            )}
                            {article.news_analysis.misinformation_flag && (
                                <Tag 
                                    value="Possible Misinformation"
                                    severity="warning"
                                    className="rounded-pill"
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
