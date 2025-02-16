import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { formatDistanceToNow } from 'date-fns';

const NewsCard = ({ article, onViewDetails }) => {
    const getSeverityColor = (category) => {
        const colors = {
            geopolitical: 'info',
            security_alerts: 'danger',
            natural_disasters: 'warning',
            social_movements: 'success',
            financial_economic: 'help'
        };
        return colors[category] || 'info';
    };

    const header = (
        <div className="relative">
            <img 
                src={article.image_url || '/placeholder-news.jpg'} 
                alt={article.title}
                className="w-full h-12rem object-cover"
                onError={(e) => e.target.src = '/placeholder-news.jpg'}
            />
            <div className="absolute top-0 right-0 m-2">
                <Tag 
                    value={article.category.replace('_', ' ')} 
                    severity={getSeverityColor(article.category)}
                />
            </div>
        </div>
    );

    const footer = (
        <div className="flex justify-content-between align-items-center">
            <div className="text-sm text-500">
                {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
            </div>
            <Button 
                label="Read More" 
                icon="pi pi-external-link" 
                onClick={() => onViewDetails(article)}
                text
            />
        </div>
    );

    return (
        <Card 
            header={header}
            footer={footer}
            className="h-full shadow-2 hover:shadow-4 transition-duration-200"
        >
            <div className="flex flex-column h-full">
                <div className="mb-3">
                    <span className="text-sm text-500">{article.source_name}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                    {article.title}
                </h3>
                <p className="line-clamp-3 text-color-secondary mb-3">
                    {article.content}
                </p>
                {article.news_analysis && (
                    <div className="mt-auto">
                        <div className="flex gap-2 flex-wrap">
                            {article.news_analysis.sentiment_score && (
                                <Tag 
                                    value={`Sentiment: ${Math.round(article.news_analysis.sentiment_score * 100)}%`}
                                    severity={article.news_analysis.sentiment_score > 0 ? 'success' : 'danger'}
                                />
                            )}
                            {article.news_analysis.bias_indicator && (
                                <Tag 
                                    value={`Bias: ${article.news_analysis.bias_indicator}`}
                                    severity="info"
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
            </div>
        </Card>
    );
};

export default NewsCard;
