import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Chart } from 'primereact/chart';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import { Message } from 'primereact/message';
import { Timeline } from 'primereact/timeline';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';

const AiInsights = ({ visible, analysis }) => {
  if (!visible) return null;

  const [activeTab, setActiveTab] = useState(0);
  
  const { 
    sentiment, 
    themes, 
    bias,
    psyops,
    sourceCredibility,
    narrativeConsistency,
    propaganda,
    summary,
    trends,
    timeline,
    gematria,
    spiritualWarfare
  } = analysis;

  // Chart data for sentiment analysis
  const chartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [sentiment.positive, sentiment.neutral, sentiment.negative],
        backgroundColor: ['#22C55E', '#64748B', '#EF4444'],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    maintainAspectRatio: false
  };

  // Trend data chart
  const trendData = {
    labels: trends.dates,
    datasets: [
      {
        label: 'Topic Relevance',
        data: trends.relevance,
        borderColor: '#3B82F6',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Sentiment Score',
        data: trends.sentiment,
        borderColor: '#10B981',
        tension: 0.4,
        fill: false
      }
    ]
  };

  const trendOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    },
    maintainAspectRatio: false
  };

  const timelineCustomMarker = (item) => {
    return (
      <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
            style={{ backgroundColor: item.color }}>
        <i className={item.icon}></i>
      </span>
    );
  };

  const getCredibilityColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const renderPsyopsIndicators = () => (
    <div className="grid">
      {psyops.techniques.map(technique => (
        <div key={technique.name} className="col-12 md:col-6">
          <div className="flex align-items-center justify-content-between mb-3">
            <span className="font-medium">{technique.name}</span>
            <Tag 
              severity={technique.detected ? 'warning' : 'success'} 
              value={technique.detected ? 'Detected' : 'Not Found'} 
            />
          </div>
          {technique.detected && (
            <Message 
              severity="warn" 
              text={technique.description} 
              className="w-full mb-3"
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderGematriaAnalysis = () => {
    const { gematria } = analysis;
    
    const significanceTemplate = (rowData) => {
      return rowData.biblicalSignificance.map((significance, index) => (
        <div key={index} className="mb-2">
          <Tag 
            severity={significance.type === 'exact' ? 'success' : 'info'}
            value={`${significance.number} - ${significance.type === 'approximate' ? '~' : ''}`}
            className="mr-2"
          />
          <span className="text-sm">{significance.meaning}</span>
        </div>
      ));
    };

    const hebrewTemplate = (rowData) => (
      <div className="flex align-items-center">
        <span className="hebrew-text text-xl mr-2" style={{ fontFamily: 'Times New Roman' }}>
          {rowData.hebrew}
        </span>
        <Tag value={rowData.value} severity="primary" />
      </div>
    );

    return (
      <div className="grid">
        <div className="col-12">
          <div className="flex justify-content-between align-items-center mb-3">
            <h3 className="text-lg font-medium m-0">Gematria Analysis</h3>
            <Tag 
              value={`Total Value: ${gematria.totalValue}`} 
              severity="primary" 
              className="text-lg"
            />
          </div>
          
          <DataTable 
            value={gematria.keyTerms}
            className="mb-4"
            responsiveLayout="scroll"
          >
            <Column field="term" header="Term" />
            <Column body={hebrewTemplate} header="Hebrew Value" />
            <Column body={significanceTemplate} header="Biblical Significance" />
          </DataTable>
        </div>

        <div className="col-12">
          <Message 
            severity="info" 
            className="w-full"
          >
            <div className="flex flex-column gap-2">
              <span className="font-medium">Spiritual Analysis</span>
              <p className="m-0 line-height-3">{gematria.interpretation}</p>
            </div>
          </Message>
        </div>
      </div>
    );
  };

  const renderSpiritualWarfareAnalysis = () => {
    const { spiritualWarfare } = analysis;
    
    const renderClassification = (classification) => (
      <div key={classification.type} className="col-12 mb-4">
        <div className="flex align-items-center gap-2 mb-2">
          <i className="pi pi-exclamation-triangle" style={{ color: 'var(--yellow-500)' }}></i>
          <span className="font-medium">{classification.name}</span>
          <Tag severity="warning" value={classification.biblicalReference} />
        </div>
        
        <p className="text-sm text-500 mb-3">{classification.description}</p>
        
        {classification.matches.keywords.length > 0 && (
          <div className="mb-2">
            <span className="text-sm font-medium">Keywords Found:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {classification.matches.keywords.map(keyword => (
                <Tag key={keyword} value={keyword} severity="danger" />
              ))}
            </div>
          </div>
        )}
        
        {classification.matches.patterns.length > 0 && (
          <div>
            <span className="text-sm font-medium">Patterns Detected:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {classification.matches.patterns.map(pattern => (
                <Tag key={pattern} value={pattern} severity="warning" />
              ))}
            </div>
          </div>
        )}
      </div>
    );

    const renderOccultReference = (reference) => (
      <div key={`${reference.type}-${reference.name}`} 
           className="flex align-items-center gap-2 mb-2">
        <i className="pi pi-eye" style={{ color: 'var(--purple-500)' }}></i>
        <span className="font-medium capitalize">{reference.name}</span>
        <span className="text-500">via reference to "{reference.reference}"</span>
      </div>
    );

    return (
      <div className="grid">
        {/* Severity Indicator */}
        <div className="col-12">
          <div className="flex justify-content-between align-items-center mb-4">
            <h3 className="text-xl font-medium m-0">Spiritual Warfare Analysis</h3>
            <Tag 
              value={`Severity: ${spiritualWarfare.severity}/100`} 
              severity={
                spiritualWarfare.severity < 30 ? 'info' :
                spiritualWarfare.severity < 60 ? 'warning' : 'danger'
              }
              className="text-lg"
            />
          </div>
        </div>

        {/* Main Interpretation */}
        <div className="col-12">
          <Message severity="warn" className="w-full mb-4">
            <div className="flex flex-column gap-2">
              <span className="font-medium">Analysis Summary</span>
              <p className="m-0 line-height-3">{spiritualWarfare.interpretation}</p>
            </div>
          </Message>
        </div>

        {/* Classifications */}
        {spiritualWarfare.classifications.length > 0 && (
          <>
            <div className="col-12">
              <h3 className="text-lg font-medium mb-3">Detected Strategies</h3>
            </div>
            {spiritualWarfare.classifications.map(renderClassification)}
          </>
        )}

        {/* Occult References */}
        {spiritualWarfare.occultReferences.length > 0 && (
          <div className="col-12">
            <h3 className="text-lg font-medium mb-3">Occult References</h3>
            <div className="surface-ground border-round p-3">
              {spiritualWarfare.occultReferences.map(renderOccultReference)}
            </div>
          </div>
        )}

        {/* Ritualistic Language */}
        {spiritualWarfare.ritualisticLanguage.length > 0 && (
          <div className="col-12">
            <h3 className="text-lg font-medium mb-3">Ritualistic Language</h3>
            <div className="flex flex-wrap gap-2">
              {spiritualWarfare.ritualisticLanguage.map(pattern => (
                <Tag key={pattern} value={pattern} severity="info" />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="ai-analysis-section" className="ai-insights mt-4">
      <Divider align="center">
        <div className="flex align-items-center gap-2">
          <i className="pi pi-brain text-xl"></i>
          <span className="font-medium">AI Analysis</span>
        </div>
      </Divider>
      
      {/* AI Summary Card with Quick Stats */}
      <Card className="mb-3">
        <div className="grid">
          <div className="col-12 md:col-8">
            <h3 className="text-lg font-medium mb-2">AI Summary</h3>
            <p className="line-height-3 m-0">{summary}</p>
          </div>
          <div className="col-12 md:col-4">
            <div className="flex flex-column gap-2">
              <div className="flex justify-content-between align-items-center">
                <span className="text-sm">Credibility</span>
                <Tag severity={getCredibilityColor(sourceCredibility.score)} 
                     value={`${sourceCredibility.score}%`} />
              </div>
              <div className="flex justify-content-between align-items-center">
                <span className="text-sm">Bias Risk</span>
                <Tag severity={bias.detected ? 'warning' : 'success'} 
                     value={bias.detected ? 'High' : 'Low'} />
              </div>
              <div className="flex justify-content-between align-items-center">
                <span className="text-sm">Manipulation</span>
                <Tag severity={psyops.techniques.some(t => t.detected) ? 'danger' : 'success'}
                     value={psyops.techniques.some(t => t.detected) ? 'Detected' : 'None'} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
        {/* Basic Analysis */}
        <TabPanel header="Analysis" leftIcon="pi pi-chart-bar mr-2">
          <div className="grid">
            <div className="col-12 md:col-4">
              <h3 className="text-lg font-medium mb-3">Sentiment Analysis</h3>
              <div style={{ height: '200px' }}>
                <Chart type="bar" data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="col-12 md:col-4">
              <h3 className="text-lg font-medium mb-3">Key Themes</h3>
              <div className="flex flex-wrap gap-2">
                {themes.map(theme => (
                  <Tag key={theme} value={theme} severity="info" className="text-sm" />
                ))}
              </div>
            </div>

            <div className="col-12 md:col-4">
              <h3 className="text-lg font-medium mb-3">Source Credibility</h3>
              <div className="flex flex-column gap-2">
                <div className="flex justify-content-between">
                  <span>Score: {sourceCredibility.score}%</span>
                  <Tag severity={getCredibilityColor(sourceCredibility.score)} 
                       value={sourceCredibility.label} />
                </div>
                <ProgressBar value={sourceCredibility.score} 
                           className="h-1rem"
                           color={`var(--${getCredibilityColor(sourceCredibility.score)}-500)`} />
                <small className="text-500">{sourceCredibility.explanation}</small>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Trends & Timeline */}
        <TabPanel header="Trends" leftIcon="pi pi-chart-line mr-2">
          <div className="grid">
            <div className="col-12">
              <h3 className="text-lg font-medium mb-3">Topic Evolution</h3>
              <div style={{ height: '300px' }}>
                <Chart type="line" data={trendData} options={trendOptions} />
              </div>
            </div>
            <div className="col-12">
              <h3 className="text-lg font-medium mb-3">Related Coverage Timeline</h3>
              <Timeline value={timeline} 
                       content={(item) => item.content}
                       marker={timelineCustomMarker}
                       className="customized-timeline" />
            </div>
          </div>
        </TabPanel>

        {/* PsyOps Analysis */}
        <TabPanel header="PsyOps" leftIcon="pi pi-exclamation-triangle mr-2">
          {renderPsyopsIndicators()}
        </TabPanel>

        {/* Narrative Analysis */}
        <TabPanel header="Narrative" leftIcon="pi pi-book mr-2">
          <div className="grid">
            <div className="col-12 md:col-6">
              <h3 className="text-lg font-medium mb-3">Bias Detection</h3>
              <div className="flex flex-column gap-2">
                <Tag severity={bias.detected ? 'warning' : 'success'} 
                     value={bias.label} 
                     className="text-sm" />
                <p className="text-sm text-500 m-0 line-height-3">{bias.description}</p>
              </div>
            </div>

            <div className="col-12 md:col-6">
              <h3 className="text-lg font-medium mb-3">Narrative Consistency</h3>
              <div className="flex flex-column gap-2">
                <Tag severity={narrativeConsistency.consistent ? 'success' : 'warning'} 
                     value={narrativeConsistency.label} />
                <p className="text-sm text-500 m-0 line-height-3">
                  {narrativeConsistency.explanation}
                </p>
              </div>
            </div>

            <div className="col-12">
              <h3 className="text-lg font-medium mb-3">Propaganda Techniques</h3>
              <div className="grid">
                {propaganda.techniques.map(technique => (
                  <div key={technique.name} className="col-12 md:col-6 lg:col-4">
                    <div className="flex align-items-center gap-2 mb-2">
                      <Tag severity={technique.confidence > 70 ? 'danger' : 'warning'} 
                           value={technique.name} />
                      <span className="text-500">({technique.confidence}% confidence)</span>
                    </div>
                    <p className="text-sm text-500 m-0 line-height-3">
                      {technique.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Gematria Analysis */}
        <TabPanel header="Gematria" leftIcon="pi pi-star mr-2">
          {renderGematriaAnalysis()}
        </TabPanel>

        {/* Spiritual Warfare Analysis */}
        <TabPanel header="Warfare" leftIcon="pi pi-shield mr-2">
          {renderSpiritualWarfareAnalysis()}
        </TabPanel>
      </TabView>
    </div>
  );
};

AiInsights.propTypes = {
  visible: PropTypes.bool.isRequired,
  analysis: PropTypes.shape({
    sentiment: PropTypes.shape({
      positive: PropTypes.number.isRequired,
      neutral: PropTypes.number.isRequired,
      negative: PropTypes.number.isRequired
    }).isRequired,
    themes: PropTypes.arrayOf(PropTypes.string).isRequired,
    bias: PropTypes.shape({
      detected: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    }).isRequired,
    psyops: PropTypes.shape({
      techniques: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        detected: PropTypes.bool.isRequired,
        description: PropTypes.string
      })).isRequired
    }).isRequired,
    sourceCredibility: PropTypes.shape({
      score: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      explanation: PropTypes.string.isRequired
    }).isRequired,
    narrativeConsistency: PropTypes.shape({
      consistent: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      explanation: PropTypes.string.isRequired
    }).isRequired,
    propaganda: PropTypes.shape({
      techniques: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        confidence: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired
      })).isRequired
    }).isRequired,
    summary: PropTypes.string.isRequired,
    trends: PropTypes.shape({
      dates: PropTypes.arrayOf(PropTypes.string).isRequired,
      relevance: PropTypes.arrayOf(PropTypes.number).isRequired,
      sentiment: PropTypes.arrayOf(PropTypes.number).isRequired
    }).isRequired,
    timeline: PropTypes.arrayOf(PropTypes.shape({
      content: PropTypes.node.isRequired,
      color: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })).isRequired,
    gematria: PropTypes.shape({
      keyTerms: PropTypes.arrayOf(PropTypes.shape({
        term: PropTypes.string.isRequired,
        hebrew: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        biblicalSignificance: PropTypes.arrayOf(PropTypes.shape({
          number: PropTypes.number.isRequired,
          meaning: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['exact', 'approximate']).isRequired,
          difference: PropTypes.number
        })).isRequired
      })).isRequired,
      totalValue: PropTypes.number.isRequired,
      interpretation: PropTypes.string.isRequired
    }).isRequired,
    spiritualWarfare: PropTypes.shape({
      classifications: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        biblicalReference: PropTypes.string.isRequired,
        matches: PropTypes.shape({
          keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
          patterns: PropTypes.arrayOf(PropTypes.string).isRequired
        }).isRequired
      })).isRequired,
      occultReferences: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        reference: PropTypes.string.isRequired
      })).isRequired,
      ritualisticLanguage: PropTypes.arrayOf(PropTypes.string).isRequired,
      severity: PropTypes.number.isRequired,
      interpretation: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default AiInsights;
