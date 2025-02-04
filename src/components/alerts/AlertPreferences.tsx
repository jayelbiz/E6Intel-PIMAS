import React from 'react';
import { Bell, MapPin, AlertTriangle, Sparkles, CloudLightning, Clock } from 'lucide-react';

const eventTypes = [
  { id: 'prophecy', label: 'Prophecy', icon: AlertTriangle },
  { id: 'disaster', label: 'Disaster', icon: CloudLightning },
  { id: 'miracle', label: 'Miracle', icon: Sparkles },
  { id: 'endTimes', label: 'End Times', icon: Clock }
];

const locations = [
  { id: 'jerusalem', label: 'Jerusalem' },
  { id: 'israel', label: 'Israel' },
  { id: 'middleEast', label: 'Middle East' },
  { id: 'global', label: 'Global' }
];

export function AlertPreferences() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-500" />
                <span>Push Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-500" />
                <span>Email Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Event Types */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Event Types</h3>
          <div className="space-y-3">
            {eventTypes.map(({ id, label, icon: Icon }) => (
              <div key={id} className="flex items-center">
                <input
                  type="checkbox"
                  id={id}
                  defaultChecked
                  className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                />
                <label htmlFor={id} className="ml-2 flex items-center">
                  <Icon className="h-4 w-4 mr-2 text-gray-500" />
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Locations</h3>
          <div className="space-y-3">
            {locations.map(({ id, label }) => (
              <div key={id} className="flex items-center">
                <input
                  type="checkbox"
                  id={id}
                  defaultChecked
                  className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                />
                <label htmlFor={id} className="ml-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Save Preferences
        </button>
      </div>
    </div>
  );
}