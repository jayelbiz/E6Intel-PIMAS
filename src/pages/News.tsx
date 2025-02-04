import React from 'react';
import { NewsAnalysis } from '../components/news/NewsAnalysis';
import { History, Filter } from 'lucide-react';

export function NewsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">News Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            AI-powered analysis of prophetic and significant events
          </p>
        </div>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <History className="h-5 w-5 mr-2" />
            History
          </button>
          <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <NewsAnalysis />
    </div>
  );
}