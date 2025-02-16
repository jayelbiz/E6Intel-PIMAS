import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { formatDistanceToNow } from 'date-fns';

const NewsModal = ({ article, visible, onHide }) => {
    if (!article) return null;

    const header = (
        <div className="flex align-items-center gap-2">
            <span className="text-xl font-bold">{article.source_name}</span>
            <Tag 
                value={article.category.replace('_', ' ')} 
                severity={article.category === 'security_alerts' ? 'danger' : 'info'}
            />
        </div>
    );

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button 
                label="Close" 
                icon="pi pi-times" 
                onClick={onHide} 
                text
            />
            <Button 
                label="Visit Source" 
                icon="pi pi-external-link" 
                onClick={() => window.open(article.url, '_blank')}
            />
        </div>
    );

    return (
        <Dialog
            header={header}
            visible={visible}
            onHide={onHide}
            footer={footer}
            style={{ width: '90vw', maxWidth: '800px' }}
            modal
            className="p-fluid"
        >
            <div className="grid">
                <div className="col-12">
                    <img 
                        src={article.image_url || '/placeholder-news.jpg'} 
                        alt={article.title}
                        className="w-full max-h-20rem object-cover mb-3"
                        onError={(e) => e.target.src = '/placeholder-news.jpg'}
                    />
                </div>
                
                <div className="col-12">
                    <h2 className="text-2xl font-bold mb-3">{article.title}</h2>
                    <p className="text-sm text-500 mb-4">
                        Published {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                    </p>
                    
                    {article.news_analysis && (
                        <div className="mb-4 p-3 surface-ground border-round">
                            <h3 className="text-lg font-semibold mb-3">AI Analysis</h3>
                            <div className="grid">
                                <div className="col-12 md:col-4">
                                    <div className="mb-3">
                                        <span className="font-semibold block mb-2">Sentiment</span>
                                        <Tag 
                                            value={`${Math.round(article.news_analysis.sentiment_score * 100)}%`}
                                            severity={article.news_analysis.sentiment_score > 0 ? 'success' : 'danger'}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 md:col-4">
                                    <div className="mb-3">
                                        <span className="font-semibold block mb-2">Bias</span>
                                        <Tag 
                                            value={article.news_analysis.bias_indicator}
                                            severity="info"
                                        />
                                    </div>
                                </div>
                                <div className="col-12 md:col-4">
                                    <div className="mb-3">
                                        <span className="font-semibold block mb-2">Verification</span>
                                        <Tag 
                                            value={article.news_analysis.misinformation_flag ? 'Needs Verification' : 'Verified'}
                                            severity={article.news_analysis.misinformation_flag ? 'warning' : 'success'}
                                        />
                                    </div>
                                </div>
                                {article.news_analysis.key_themes && (
                                    <div className="col-12">
                                        <span className="font-semibold block mb-2">Key Themes</span>
                                        <div className="flex gap-2 flex-wrap">
                                            {article.news_analysis.key_themes.map((theme, index) => (
                                                <Tag key={index} value={theme} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <div className="text-color-secondary whitespace-pre-line">
                        {article.content}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default NewsModal;
