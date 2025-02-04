import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';

interface EventCardProps {
  title: string;
  type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes';
  location: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const severityConfig = {
  low: { severity: 'success', label: 'Low' },
  medium: { severity: 'warning', label: 'Medium' },
  high: { severity: 'danger', label: 'High' }
};

const typeConfig = {
  prophecy: { severity: 'info', icon: 'pi pi-exclamation-triangle', label: 'Prophecy' },
  disaster: { severity: 'danger', icon: 'pi pi-cloud', label: 'Disaster' },
  miracle: { severity: 'success', icon: 'pi pi-star', label: 'Miracle' },
  endTimes: { severity: 'warning', icon: 'pi pi-clock', label: 'End Times' }
};

export function EventCard({ title, type, location, timestamp, severity }: EventCardProps) {
  return (
    <Card className="mb-2 shadow-sm border-1 surface-border">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-base font-medium m-0 mb-2">{title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Tag
                value={typeConfig[type].label}
                icon={typeConfig[type].icon}
                severity={typeConfig[type].severity}
              />
              <Tag 
                value={severityConfig[severity].label} 
                severity={severityConfig[severity].severity}
              />
            </div>
          </div>
          <Button 
            icon="pi pi-ellipsis-v" 
            rounded 
            text 
            severity="secondary"
            size="small"
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-600 flex items-center gap-1">
            <i className="pi pi-map-marker" />
            {location}
          </span>
          <span className="text-500 flex items-center gap-1">
            <i className="pi pi-clock" />
            {timestamp}
          </span>
        </div>
      </div>
    </Card>
  );
}