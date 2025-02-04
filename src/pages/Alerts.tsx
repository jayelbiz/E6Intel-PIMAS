import React, { useState } from 'react';
import { AlertsList } from '../components/alerts/AlertsList';
import { AlertPreferences } from '../components/alerts/AlertPreferences';
import { Settings, Bell } from 'lucide-react';

export function AlertsPage() {
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Stay informed about prophetic events and significant developments
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {showPreferences ? (
              <>
                <Bell className="h-5 w-5 mr-2" />
                View Alerts
              </>
            ) : (
              <>
                <Settings className="h-5 w-5 mr-2" />
                Preferences
              </>
            )}
          </button>
        </div>
      </div>

      {showPreferences ? <AlertPreferences /> : <AlertsList />}
    </div>
  );
}