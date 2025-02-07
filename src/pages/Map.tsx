import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import { Icon, LatLngTuple } from 'leaflet'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Sidebar } from 'primereact/sidebar'
import { NewsFeed } from '@/components/feed/NewsFeed'
import { Tag } from 'primereact/tag'
import { Card } from '@/components/ui/card'

interface MapEvent {
  id: string
  title: string
  type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
  location: LatLngTuple
  timestamp: string
  severity: 'low' | 'medium' | 'high'
  description: string
  source?: string
  media?: string[]
}

const mockEvents: MapEvent[] = [
  {
    id: '1',
    title: 'Unusual Celestial Event',
    type: 'prophecy',
    location: [31.7683, 35.2137], // Jerusalem
    timestamp: '2 hours ago',
    severity: 'high',
    description: 'Multiple witnesses reported strange lights in the sky over Jerusalem',
    source: 'Jerusalem Post'
  },
  {
    id: '2',
    title: 'Ancient Manuscript Discovery',
    type: 'miracle',
    location: [31.5497, 35.4663], // Dead Sea
    timestamp: '5 hours ago',
    severity: 'medium',
    description: 'Archaeological team discovers ancient prophetic texts',
    source: 'Biblical Archaeology Review'
  },
  {
    id: '3',
    title: 'Regional Weather Anomaly',
    type: 'disaster',
    location: [33.8938, 35.5018], // Beirut
    timestamp: '1 day ago',
    severity: 'high',
    description: 'Unprecedented weather patterns affecting multiple countries',
    source: 'Reuters'
  }
]

const typeConfig = {
  prophecy: {
    label: 'Prophecy',
    icon: 'pi pi-exclamation-triangle',
    color: 'var(--blue-500)',
    markerColor: '#3B82F6'
  },
  disaster: {
    label: 'Disaster',
    icon: 'pi pi-cloud',
    color: 'var(--red-500)',
    markerColor: '#EF4444'
  },
  miracle: {
    label: 'Miracle',
    icon: 'pi pi-star',
    color: 'var(--green-500)',
    markerColor: '#10B981'
  },
  endTimes: {
    label: 'End Times',
    icon: 'pi pi-clock',
    color: 'var(--yellow-500)',
    markerColor: '#F59E0B'
  }
}

const severityConfig = {
  low: { label: 'Low', severity: 'success' },
  medium: { label: 'Medium', severity: 'warning' },
  high: { label: 'High', severity: 'danger' }
}

export function MapPage() {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const createMarkerIcon = (type: keyof typeof typeConfig) => {
    const config = typeConfig[type]
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${config.markerColor}" d="M12 0C7.6 0 4 3.6 4 8c0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
      </svg>
    `

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  }

  const filteredEvents = mockEvents.filter(event => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) {
      return false
    }
    if (searchQuery) {
      return (
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-surface-card/95 backdrop-blur-sm shadow-sm p-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <Button
            icon="pi pi-bars"
            onClick={() => setSidebarVisible(true)}
            text
            rounded
          />
          
          <span className="p-input-icon-left flex-1">
            <i className="pi pi-search" />
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full"
            />
          </span>

          <div className="flex gap-2">
            {Object.entries(typeConfig).map(([type, config]) => (
              <Button
                key={type}
                icon={config.icon}
                onClick={() => {
                  setSelectedTypes(prev =>
                    prev.includes(type)
                      ? prev.filter(t => t !== type)
                      : [...prev, type]
                  )
                }}
                severity={selectedTypes.includes(type) ? 'primary' : 'secondary'}
                text
                rounded
                tooltip={config.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-[400px] surface-card shadow-2 z-10 p-4">
        <NewsFeed onItemClick={(item) => {
          if (item.coordinates) {
            // TODO: Pan map to coordinates
          }
        }} />
      </div>

      {/* Map */}
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
        <ZoomControl position="bottomright" />
        
        {filteredEvents.map((event) => (
          <Marker
            key={event.id}
            position={event.location}
            icon={createMarkerIcon(event.type)}
            eventHandlers={{
              click: () => setSelectedEvent(event)
            }}
          >
            <Popup>
              <Card className="w-72 shadow-none border-none p-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag
                      value={typeConfig[event.type].label}
                      icon={typeConfig[event.type].icon}
                      severity={event.type as any}
                    />
                    <Tag
                      value={severityConfig[event.severity].label}
                      severity={event.severity as any}
                    />
                  </div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm">{event.description}</p>
                  <div className="flex items-center justify-between text-sm text-text-color-secondary">
                    <span className="flex items-center gap-1">
                      <i className="pi pi-clock" />
                      {event.timestamp}
                    </span>
                    <Button
                      label="Details"
                      icon="pi pi-arrow-right"
                      text
                      size="small"
                      className="p-0"
                    />
                  </div>
                </div>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}