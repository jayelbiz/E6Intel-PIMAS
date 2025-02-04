import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import 'leaflet/dist/leaflet.css';

interface Event {
  id: string;
  title: string;
  type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes';
  location: [number, number];
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Unusual Celestial Event',
    type: 'prophecy',
    location: [31.7683, 35.2137], // Jerusalem
    timestamp: '2 hours ago',
    severity: 'high',
    description: 'Multiple witnesses reported strange lights in the sky over Jerusalem'
  },
  {
    id: '2',
    title: 'Unprecedented Weather',
    type: 'disaster',
    location: [33.8938, 35.5018], // Beirut
    timestamp: '5 hours ago',
    severity: 'medium',
    description: 'Unusual weather patterns affecting multiple countries in the region'
  },
  {
    id: '3',
    title: 'Ancient Manuscript Found',
    type: 'miracle',
    location: [31.5497, 35.4663], // Dead Sea
    timestamp: '1 day ago',
    severity: 'low',
    description: 'Archaeological team discovers ancient prophetic texts'
  }
];

const typeIcons = {
  prophecy: `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4" /><path d="M12 17h.01" />`,
  disaster: `<path d="M11.5 20h-7L3 17H2l.5-2h1L7 7.3C7.2 6.5 7.9 6 8.7 6h.2c.8 0 1.5.5 1.8 1.3L13 15h1l.5 2h-1l-1.5 3h-0.5Z" /><path d="m3 17 6.5-15h5L21 17" /><path d="M13 17h7l1.5-3h1l-.5-2h-1L18 4.3C17.8 3.5 17.1 3 16.3 3h-.2c-.8 0-1.5.5-1.8 1.3L12 12h-1l-.5 2h1l1.5 3Z" />`,
  miracle: `<path d="M12 3a6 6 0 0 0-6 9 6 6 0 0 0 12 0 6 6 0 0 0-6-9Z" /><path d="m12 12 8.5 8.5" /><path d="m19 15-3.5 3.5" /><path d="m15 19-3.5 3.5" />`,
  endTimes: `<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />`
};

const severityColors = {
  low: 'var(--green-500)',
  medium: 'var(--yellow-500)',
  high: 'var(--red-500)'
};

const typeConfig = {
  prophecy: { severity: 'info', icon: 'pi pi-exclamation-triangle', label: 'Prophecy' },
  disaster: { severity: 'danger', icon: 'pi pi-cloud', label: 'Disaster' },
  miracle: { severity: 'success', icon: 'pi pi-star', label: 'Miracle' },
  endTimes: { severity: 'warning', icon: 'pi pi-clock', label: 'End Times' }
};

export function MapView() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const createIcon = (type: keyof typeof typeIcons, severity: keyof typeof severityColors) => {
    const color = severityColors[severity];
    const iconPath = typeIcons[type];
    
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
        ${iconPath}
      </svg>
    `;

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <MapContainer
        center={[31.7683, 35.2137]} // Jerusalem
        zoom={7}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {events.map((event) => (
          <Marker
            key={event.id}
            position={event.location}
            icon={createIcon(event.type, event.severity)}
            eventHandlers={{
              click: () => setSelectedEvent(event),
            }}
          >
            <Popup>
              <Card className="w-72 shadow-none border-none">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium m-0">{event.title}</h3>
                  <p className="text-sm text-600 m-0">{event.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Tag
                      value={typeConfig[event.type].label}
                      icon={typeConfig[event.type].icon}
                      severity={typeConfig[event.type].severity}
                    />
                    <Tag
                      icon="pi pi-clock"
                      severity="secondary"
                      value={event.timestamp}
                    />
                  </div>
                  <Button
                    label="View Details"
                    icon="pi pi-external-link"
                    text
                    className="p-0 justify-start"
                  />
                </div>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}