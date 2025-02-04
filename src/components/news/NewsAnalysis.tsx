import React, { useState } from 'react';
import { Send, AlertTriangle, Sparkles, CloudLightning, Clock, Gauge } from 'lucide-react';

interface AnalysisResult {
  id: string;
  title: string;
  url: string;
  timestamp: string;
  classification: 'prophecy' | 'disaster' | 'miracle' | 'endTimes';
  confidence: number;
  keywords: string[];
  summary: string;
}

const mockResults: AnalysisResult[] = [
  {
    id: '1',
    title: 'Rare Astronomical Alignment Over Jerusalem Draws Global Attention',
    url: 'https://example.com/article1',
    timestamp: '2 hours ago',
    classification: 'prophecy',
    confidence: 0.89,
    keywords: ['celestial', 'alignment', 'Jerusalem', 'prophecy', 'signs'],
    summary: 'Astronomers and religious scholars discuss the significance of an unusual stellar configuration above Jerusalem.'
  },
  {
    id: '2',
    title: 'Ancient Scroll Discovered in Dead Sea Cave Contains Unknown Prophecies',
    url: 'https://example.com/article2',
    timestamp: '1 day ago',
    classification: 'miracle',
    confidence: 0.95,
    keywords: ['scroll', 'Dead Sea', 'prophecy', 'discovery', 'ancient'],
    summary: 'Archaeological team uncovers well-preserved scroll with previously unknown prophetic content.'
  }
];

const classificationIcons = {
  prophecy: AlertTriangle,
  disaster: CloudLightning,
  miracle: Sparkles,
  endTimes: Clock
};

export function NewsAnalysis() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AnalysisResult[]>(mockResults);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual AI analysis
    setUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Submit URL Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Analyze News Article</h2>
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter article URL..."
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2"
            required
          />
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Send className="h-5 w-5 mr-2" />
            Analyze
          </button>
        </div>
      </form>

      {/* Analysis Results */}
      <div className="space-y-4">
        {results.map((result) => {
          const Icon = classificationIcons[result.classification];
          return (
            <div key={result.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{result.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {result.url}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{result.classification}</span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {/* Confidence Score */}
                <div className="flex items-center space-x-2">
                  <Gauge className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {Math.round(result.confidence * 100)}% confidence
                  </span>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Summary */}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {result.summary}
                </p>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {result.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}