import React from 'react';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';

interface Keyword {
  text: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

const keywords: Keyword[] = [
  { text: 'Jerusalem', count: 245, trend: 'up' },
  { text: 'Prophecy', count: 189, trend: 'up' },
  { text: 'Signs', count: 156, trend: 'stable' },
  { text: 'Temple', count: 134, trend: 'down' },
  { text: 'Revelation', count: 98, trend: 'up' },
];

const trendConfig = {
  up: { icon: 'pi pi-arrow-up', severity: 'success' },
  down: { icon: 'pi pi-arrow-down', severity: 'danger' },
  stable: { icon: 'pi pi-minus', severity: 'info' }
};

export function TrendingKeywords() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold m-0">Trending Keywords</h2>
        <Tag icon="pi pi-chart-line" severity="info" value="Live" />
      </div>
      <div className="space-y-3">
        {keywords.map((keyword) => (
          <div key={keyword.text} className="flex items-center justify-between p-2 surface-ground border-round">
            <div className="flex items-center gap-2">
              <Tag
                value={keyword.text}
                severity="primary"
              />
              <span className="text-600 text-sm">{keyword.count}</span>
            </div>
            <Tag
              icon={trendConfig[keyword.trend].icon}
              severity={trendConfig[keyword.trend].severity}
            />
          </div>
        ))}
      </div>
    </div>
  );
}