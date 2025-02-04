import React from 'react';
import { MapView } from '../components/map/MapView';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export function MapPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Global Event Map</h1>
            <p className="text-sm text-600">Track prophetic events and patterns worldwide</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText placeholder="Search locations..." className="w-64" />
            </span>
            <Button 
              label="Filters"
              icon="pi pi-filter"
              severity="secondary"
            />
          </div>
        </div>
      </div>
      <MapView />
    </div>
  );
}