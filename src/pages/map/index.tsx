import { useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon, LatLngTuple } from 'leaflet'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'

// Types for map events and markers
interface MapEvent {
  id: string
  title: string
  type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
  location: LatLngTuple
  timestamp: string
  severity: 'low' | 'medium' | 'high'
  description: string
}

// Configuration for event types and their visual representation
const eventTypeConfig = {
  prophecy: {
    label: 'Prophecy',
    icon: 'pi pi-exclamation-triangle',
    color: 'var(--blue-500)'
  },
  disaster: {
    label: 'Disaster',
    icon: 'pi pi-cloud',
    color: 'var(--red-500)'
  },
  miracle: {
    label: 'Miracle',
    icon: 'pi pi-star',
    color: 'var(--green-500)'
  },
  endTimes: {
    label: 'End Times',
    icon: 'pi pi-clock',
    color: 'var(--yellow-500)'
  }
}

// Mock data for demonstration
const mockEvents: MapEvent[] = [
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
]

// Create custom marker icons for each event type
function createMarkerIcon(type: keyof typeof eventTypeConfig) {
  const config = eventTypeConfig[type]
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="${config.color}" opacity="0.2" />
      <circle cx="12" cy="12" r="6" fill="${config.color}" />
    </svg>
  `

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

// Map control component for handling map interactions
function MapControls() {
  const map = useMap()

  const handleLocate = useCallback(() => {
    map.locate({ setView: true, maxZoom: 8 })
  }, [map])

  const handleReset = useCallback(() => {
    map.setView([31.7683, 35.2137], 7)
  }, [map])

  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <Button
        icon="pi pi-compass"
        onClick={handleLocate}
        tooltip="Locate Me"
        tooltipOptions={{ position: 'left' }}
        rounded
        size="small"
      />
      <Button
        icon="pi pi-home"
        onClick={handleReset}
        tooltip="Reset View"
        tooltipOptions={{ position: 'left' }}
        rounded
        size="small"
      />
    </div>
  )
}

export function MapPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  const typeOptions = [
    { label: 'All Events', value: 'all' },
    ...Object.entries(eventTypeConfig).map(([value, config]) => ({
      label: config.label,
      value
    }))
  ]

  return (
    <div className="h-[calc(100vh-3rem)]">
      {/* Map Controls Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-surface-card/95 backdrop-blur-sm border-b border-surface-border p-4">
        <Container>
          <div className="flex items-center gap-4">
            <span className="p-input-icon-left flex-1 max-w-md">
              <i className="pi pi-search" />
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search locations..."
                className="w-full"
              />
            </span>
            <Dropdown
              value={selectedType}
              onChange={(e) => setSelectedType(e.value)}
              options={typeOptions}
              className="w-48"
            />
            <div className="flex gap-2">
              {Object.entries(eventTypeConfig).map(([type, config]) => (
                <Tag
                  key={type}
                  value={config.label}
                  icon={config.icon}
                  severity={type as any}
                />
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[31.7683, 35.2137]} // Jerusalem
        zoom={7}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapControls />
        
        {mockEvents
          .filter(event => selectedType === 'all' || event.type === selectedType)
          .map((event) => (
            <Marker
              key={event.id}
              position={event.location}
              icon={createMarkerIcon(event.type)}
            >
              <Popup>
                <Card className="w-72 shadow-none border-none p-0">
                  <Card.Header>
                    <Card.Title>{event.title}</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-sm mb-2">{event.description}</p>
                    <div className="flex gap-2">
                      <Tag
                        value={eventTypeConfig[event.type].label}
                        icon={eventTypeConfig[event.type].icon}
                        severity={event.type as any}
                      />
                      <Tag
                        value={event.timestamp}
                        icon="pi pi-clock"
                        severity="secondary"
                      />
                    </div>
                  </Card.Content>
                  <Card.Footer>
                    <Button
                      label="View Details"
                      icon="pi pi-external-link"
                      text
                      className="p-0"
                    />
                  </Card.Footer>
                </Card>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}