import React from 'react';
import { Bell, Clock, MapPin, AlertTriangle, Sparkles, CloudLightning, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Alert {
  id: string;
  title: string;
  type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes';
  location: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  read: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Critical Event: Jerusalem Temple Mount Activity',
    type: 'prophecy',
    location: 'Jerusalem, Israel',
    timestamp: '10 minutes ago',
    severity: 'high',
    description: 'Unusual activity reported at the Temple Mount, multiple witnesses confirm supernatural phenomena.',
    read: false
  },
  {
    id: '2',
    title: 'Weather Anomaly in Mediterranean',
    type: 'disaster',
    location: 'Mediterranean Sea',
    timestamp: '1 hour ago',
    severity: 'medium',
    description: 'Unprecedented weather patterns detected across the Mediterranean region.',
    read: false
  },
  {
    id: '3',
    title: 'Ancient Artifact Discovery',
    type: 'miracle',
    location: 'Qumran Caves',
    timestamp: '3 hours ago',
    severity: 'low',
    description: 'New Dead Sea Scroll fragments found containing prophetic content.',
    read: true
  }
];

const typeIcons = {
  prophecy: AlertTriangle,
  disaster: CloudLightning,
  miracle: Sparkles,
  endTimes: Clock
};

const severityColors = {
  low: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
  medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
  high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
};

export function AlertsList() {
  return (
    <div className="space-y-4">
      {mockAlerts.map((alert) => {
        const Icon = typeIcons[alert.type];
        return (
          <div
            key={alert.id}
            className={cn(
              "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4",
              alert.read ? "border-gray-200 dark:border-gray-700" : "border-primary",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{alert.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {alert.description}
                </p>
              </div>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                severityColors[alert.severity]
              )}>
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {alert.location}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {alert.timestamp}
                </span>
              </div>
              <button className="flex items-center text-primary hover:text-primary/90">
                <ExternalLink className="h-4 w-4 mr-1" />
                View Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}