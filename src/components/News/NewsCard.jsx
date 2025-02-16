import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { formatDistanceToNow } from 'date-fns';
import { NEWS_CATEGORY_LABELS, NEWS_CATEGORY_COLORS } from '../../constants';

const NewsCard = ({ article, onViewDetails }) => {
    const header = (
        <div className="relative">
            <img 
                src={article.image_url || '/placeholder-news.jpg'} 
                alt={article.title}
                className="w-full h-12rem object-cover"
                onError={(e) => e.target.src = '/placeholder-news.jpg'}
            />
            <div className="absolute bottom-0 left-0 w-full p-3 bg-black-alpha-50">
                <Tag 
                    value={NEWS_CATEGORY_LABELS[article.category]} 
                    severity={NEWS_CATEGORY_COLORS[article.category]}
                    className="mr-2"
                />
                <span className="text-white font-medium">{article.source_name}</span>
            </div>
        </div>
    );

    const footer = (
        <div className="flex justify-content-between align-items-center">
            <span className="text-sm text-500">
                {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
            </span>
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-bookmark" 
                    className="p-button-rounded p-button-text"
                    tooltip="Bookmark"
                    tooltipOptions={{ position: 'top' }}
                />
                <Button 
                    icon="pi pi-external-link" 
                    className="p-button-rounded p-button-text"
                    tooltip="View Details"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => onViewDetails(article)}
                />
            </div>
        </div>
    );

    return (
        <Card 
            header={header} 
            footer={footer}
            className="shadow-2 hover:shadow-4 transition-duration-200 cursor-pointer"
            onClick={() => onViewDetails(article)}
        >
            <div className="h-10rem overflow-hidden">
                <h5 className="mt-0 mb-2 line-clamp-2">{article.title}</h5>
                <p className="m-0 text-600 line-clamp-3">{article.summary || article.content}</p>
            </div>
            {article.news_analysis && (
                <div className="mt-3 p-2 surface-100 border-round">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-chart-bar text-primary"></i>
                        <span className="font-medium">AI Analysis</span>
                    </div>
                    <div className="mt-2 text-sm">
                        {article.news_analysis.sentiment_score && (
                            <Tag 
                                value={`Sentiment: ${Math.round(article.news_analysis.sentiment_score * 100)}%`}
                                severity={article.news_analysis.sentiment_score > 0 ? 'success' : 'danger'}
                                className="mr-2"
                            />
                        )}
                        {article.news_analysis.bias_indicator && (
                            <Tag 
                                value={`Bias: ${article.news_analysis.bias_indicator}`}
                                severity="info"
                                className="mr-2"
                            />
                        )}
                        {article.news_analysis.misinformation_flag && (
                            <Tag 
                                value="Possible Misinformation"
                                severity="warning"
                            />
                        )}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default NewsCard;
