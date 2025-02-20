import React, { useState, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { getCategoryHierarchy } from '@/constants/categories';
import { calculateReadingTime, stripHtml } from '@/utils/contentProcessor';
import { analyzeText } from '@/utils/gematriaAnalyzer';

import ArticleHeader from './ArticleContent/ArticleHeader';
import ArticleFooter from './ArticleContent/ArticleFooter';
import ArticleMetadata from './ArticleContent/ArticleMetadata';
import AiInsights from './ArticleContent/AiInsights';

const ArticleContent = ({ article, visible, onHide }) => {
  const [showAiInsights, setShowAiInsights] = useState(false);
  const contentRef = useRef(null);
  
  if (!article) return null;

  const category = getCategoryHierarchy(article.category);
  const readingTime = calculateReadingTime(article.content);
  
  // Process article content
  const processContent = useCallback((content) => {
    if (!content) return [];
    const cleanContent = stripHtml(content);
    return cleanContent
      .split('\n')
      .filter(para => para.trim().length > 0)
      .map(para => para.trim());
  }, []);

  const paragraphs = processContent(article.content);

  // Process article content for Gematria analysis
  const gematriaResults = useMemo(() => {
    if (!article) return null;
    const textToAnalyze = `${article.title} ${article.description || ''} ${article.content || ''}`;
    const analysis = analyzeText(textToAnalyze);
    
    // Add spiritual interpretation based on total value and key terms
    const interpretation = `The total Gematria value of ${analysis.totalValue} suggests significant spiritual implications. Key terms identified show connections to biblical themes of ${analysis.keyTerms.slice(0, 3).map(term => term.biblicalSignificance[0].meaning).join(', ')}. Consider these numerical patterns when interpreting the broader spiritual context of this article.`;
    
    return {
      ...analysis,
      interpretation
    };
  }, [article]);

  // Mock AI analysis data (replace with real API call)
  const mockAnalysis = {
    sentiment: {
      positive: 75,
      neutral: 20,
      negative: 5
    },
    themes: ['Economy', 'Politics', 'Technology'],
    bias: {
      detected: true,
      label: 'Potential Bias Detected',
      description: 'This article shows signs of political bias in its language and framing.'
    },
    psyops: {
      techniques: [
        {
          name: 'Emotional Manipulation',
          detected: true,
          description: 'Uses emotionally charged language to influence reader opinion.'
        },
        {
          name: 'Fear Appeal',
          detected: true,
          description: 'Employs fear-based rhetoric to create urgency or concern.'
        },
        {
          name: 'Social Proof',
          detected: false,
          description: null
        },
        {
          name: 'Authority Appeal',
          detected: true,
          description: 'References to unnamed experts or authorities without verification.'
        }
      ]
    },
    sourceCredibility: {
      score: 65,
      label: 'Moderate Credibility',
      explanation: 'Source has a mixed track record of accuracy and bias in reporting.'
    },
    narrativeConsistency: {
      consistent: false,
      label: 'Inconsistencies Found',
      explanation: 'Key details differ from other mainstream coverage of this topic.'
    },
    propaganda: {
      techniques: [
        {
          name: 'Loaded Language',
          confidence: 85,
          description: 'Uses specific words to influence emotions and opinions.'
        },
        {
          name: 'Repetition',
          confidence: 75,
          description: 'Key phrases repeated to reinforce specific viewpoints.'
        },
        {
          name: 'False Dilemma',
          confidence: 60,
          description: 'Presents complex issues as simple binary choices.'
        }
      ]
    },
    trends: {
      dates: ['Jan 15', 'Jan 20', 'Jan 25', 'Jan 30', 'Feb 5', 'Feb 10', 'Feb 15', 'Feb 20'],
      relevance: [30, 45, 60, 85, 90, 75, 65, 70],
      sentiment: [60, 55, 45, 35, 30, 40, 50, 45]
    },
    timeline: [
      {
        content: (
          <div className="flex flex-column">
            <span className="font-medium mb-2">Initial Coverage</span>
            <p className="text-sm text-500 m-0">First reports emerge about the topic with neutral coverage.</p>
          </div>
        ),
        color: '#3B82F6',
        icon: 'pi pi-flag'
      },
      {
        content: (
          <div className="flex flex-column">
            <span className="font-medium mb-2">Narrative Shift</span>
            <p className="text-sm text-500 m-0">Coverage begins to show more polarized perspectives.</p>
          </div>
        ),
        color: '#F59E0B',
        icon: 'pi pi-directions'
      },
      {
        content: (
          <div className="flex flex-column">
            <span className="font-medium mb-2">Peak Coverage</span>
            <p className="text-sm text-500 m-0">Topic reaches maximum media attention with diverse viewpoints.</p>
          </div>
        ),
        color: '#10B981',
        icon: 'pi pi-chart-line'
      },
      {
        content: (
          <div className="flex flex-column">
            <span className="font-medium mb-2">Current Article</span>
            <p className="text-sm text-500 m-0">This article's position in the ongoing narrative.</p>
          </div>
        ),
        color: '#6366F1',
        icon: 'pi pi-bookmark'
      }
    ],
    summary: 'This article discusses economic policy changes with a focus on their potential impact on market stability. While it presents some valid concerns, the analysis reveals emotional manipulation tactics and potential bias in its presentation. The source has moderate credibility, but there are notable inconsistencies with other coverage of this topic. Exercise critical thinking when considering the conclusions drawn.',
    gematria: gematriaResults
  };

  const handleSave = useCallback(() => {
    // Implement save functionality
    console.log('Saving article:', article.title);
  }, [article.title]);

  const handleShare = useCallback(() => {
    // Implement share functionality
    console.log('Sharing article:', article.title);
  }, [article.title]);

  const toggleAiInsights = useCallback(() => {
    setShowAiInsights(prev => !prev);
  }, []);

  // Reset scroll position when modal opens
  const onShow = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <Dialog
      header={
        <ArticleHeader
          title={article.title}
          showAiInsights={showAiInsights}
          onToggleInsights={toggleAiInsights}
        />
      }
      visible={visible}
      onHide={onHide}
      onShow={onShow}
      footer={
        <ArticleFooter
          readingTime={readingTime}
          url={article.url}
          onSave={handleSave}
          onShare={handleShare}
        />
      }
      className="article-dialog"
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      style={{ width: '60vw' }}
      maximizable
    >
      <div ref={contentRef} className="article-content">
        {/* Article Metadata */}
        <ArticleMetadata
          publishedAt={article.publishedAt}
          author={article.author}
          source={article.source}
          category={category}
        />

        {/* Article Image */}
        {article.urlToImage && (
          <div className="mb-4 article-image-container">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full border-round"
              loading="lazy"
            />
            {article.source?.name && (
              <div className="image-source">
                Source: {article.source.name}
              </div>
            )}
          </div>
        )}

        {/* Article Description */}
        {article.description && (
          <div className="mb-4">
            <p className="text-xl line-height-3 font-medium text-primary">
              {article.description}
            </p>
          </div>
        )}

        {/* Article Content */}
        <div className="article-body">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="line-height-3 mb-3">
                {paragraph}
              </p>
            ))
          ) : (
            <div className="p-3 surface-ground border-round">
              <p className="text-500 m-0">
                Full article content is available at the source. Click "Read Full Article" to view.
              </p>
            </div>
          )}
        </div>

        {/* AI Insights at the bottom */}
        <AiInsights visible={showAiInsights} analysis={mockAnalysis} />
      </div>
    </Dialog>
  );
};

ArticleContent.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    content: PropTypes.string,
    url: PropTypes.string,
    urlToImage: PropTypes.string,
    publishedAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    author: PropTypes.string,
    source: PropTypes.shape({
      name: PropTypes.string
    }),
    category: PropTypes.string
  }),
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
};

export default ArticleContent;
