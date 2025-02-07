import { useState } from 'react'
import { DataTable, Column, Tag, Button } from 'primereact/datatable'
import { Card } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

interface GlobalEvent {
  id: string
  title: string
  type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
  location: string
  timestamp: string
  severity: 'low' | 'medium' | 'high'
  status: 'active' | 'resolved' | 'pending'
  description: string
}

const mockEvents: GlobalEvent[] = [
  {
    id: '1',
    title: 'Unusual Celestial Phenomena Over Jerusalem',
    type: 'prophecy',
    location: 'Jerusalem, Israel',
    timestamp: '2024-03-15T10:30:00Z',
    severity: 'high',
    status: 'active',
    description: 'Multiple witnesses report unprecedented astronomical events visible over Jerusalem.'
  },
  {
    id: '2',
    title: 'Ancient Manuscript Discovery',
    type: 'miracle',
    location: 'Dead Sea Region',
    timestamp: '2024-03-14T15:45:00Z',
    severity: 'medium',
    status: 'active',
    description: 'Archaeological team uncovers well-preserved prophetic texts.'
  },
  {
    id: '3',
    title: 'Regional Weather Anomalies',
    type: 'disaster',
    location: 'Mediterranean Basin',
    timestamp: '2024-03-13T08:15:00Z',
    severity: 'high',
    status: 'pending',
    description: 'Unprecedented weather patterns affecting multiple countries.'
  },
  {
    id: '4',
    title: 'Mass Prayer Gathering',
    type: 'endTimes',
    location: 'Temple Mount',
    timestamp: '2024-03-12T12:00:00Z',
    severity: 'medium',
    status: 'resolved',
    description: 'Spontaneous gathering of thousands in prayer at sacred site.'
  }
]

const typeConfig = {
  prophecy: { icon: 'pi pi-exclamation-triangle', severity: 'info' },
  disaster: { icon: 'pi pi-cloud', severity: 'danger' },
  miracle: { icon: 'pi pi-star', severity: 'success' },
  endTimes: { icon: 'pi pi-clock', severity: 'warning' }
}

const severityConfig = {
  low: { label: 'Low', severity: 'success' },
  medium: { label: 'Medium', severity: 'warning' },
  high: { label: 'High', severity: 'danger' }
}

const statusConfig = {
  active: { label: 'Active', severity: 'info' },
  resolved: { label: 'Resolved', severity: 'success' },
  pending: { label: 'Pending', severity: 'warning' }
}

export function GlobalEvents() {
  const [selectedEvent, setSelectedEvent] = useState<GlobalEvent | null>(null)
  const navigate = useNavigate()

  const typeBodyTemplate = (event: GlobalEvent) => (
    <Tag
      value={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
      icon={typeConfig[event.type].icon}
      severity={typeConfig[event.type].severity as any}
    />
  )

  const severityBodyTemplate = (event: GlobalEvent) => (
    <Tag
      value={severityConfig[event.severity].label}
      severity={severityConfig[event.severity].severity as any}
    />
  )

  const statusBodyTemplate = (event: GlobalEvent) => (
    <Tag
      value={statusConfig[event.status].label}
      severity={statusConfig[event.status].severity as any}
    />
  )

  const timestampBodyTemplate = (event: GlobalEvent) => (
    <span>{new Date(event.timestamp).toLocaleString()}</span>
  )

  const actionBodyTemplate = (event: GlobalEvent) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-eye"
        text
        rounded
        onClick={() => navigate(`/analysis/${event.id}`)}
        tooltip="View Details"
      />
      <Button
        icon="pi pi-map-marker"
        text
        rounded
        onClick={() => navigate(`/map?event=${event.id}`)}
        tooltip="View on Map"
      />
      <Button
        icon="pi pi-share-alt"
        text
        rounded
        tooltip="Share"
      />
    </div>
  )

  return (
    <div className="grid">
      {/* Main News Section */}
      <div className="col-12 lg:col-8">
        <Card className="mb-3">
          <Card.Header>
            <div className="flex justify-content-between align-items-center">
              <div>
                <Card.Title>Breaking News</Card.Title>
                <Card.Description>Latest prophetic events and developments</Card.Description>
              </div>
              <Button
                label="View Map"
                icon="pi pi-map"
                onClick={() => navigate('/map')}
              />
            </div>
          </Card.Header>
          
          <DataTable
            value={mockEvents}
            selection={selectedEvent}
            onSelectionChange={(e) => setSelectedEvent(e.value)}
            dataKey="id"
            rows={5}
            className="mt-3"
          >
            <Column field="title" header="Title" sortable />
            <Column field="type" header="Type" body={typeBodyTemplate} sortable />
            <Column field="location" header="Location" sortable />
            <Column
              field="timestamp"
              header="Time"
              body={timestampBodyTemplate}
              sortable
            />
            <Column body={actionBodyTemplate} />
          </DataTable>
        </Card>
      <Card.Header>
        <div className="flex justify-between items-center">
          <div>
            <Card.Title>Global Events</Card.Title>
            <Card.Description>
              Real-time tracking of prophetic and significant events
            </Card.Description>
          </div>
          <div className="flex gap-2">
            <Button
              label="Submit Event"
              icon="pi pi-plus"
              onClick={() => navigate('/submit-report')}
            />
            <Button
              label="View Map"
              icon="pi pi-map"
              severity="secondary"
              onClick={() => navigate('/map')}
            />
          </div>
        </div>
      </Card.Header>

        {/* Featured Analysis */}
        <Card>
          <Card.Header>
            <Card.Title>Featured Analysis</Card.Title>
          </Card.Header>
          <div className="grid mt-3">
            {mockEvents.slice(0, 3).map(event => (
              <div key={event.id} className="col-12 md:col-4">
                <div className="p-3 border-round surface-hover cursor-pointer">
                  <div className="flex gap-2 mb-3">
                    {typeBodyTemplate(event)}
                    {severityBodyTemplate(event)}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{event.title}</h3>
                  <p className="text-color-secondary mb-3">{event.description}</p>
                  <div className="flex justify-content-between align-items-center">
                    <span className="text-sm">{event.location}</span>
                    <Button
                      label="Read More"
                      icon="pi pi-arrow-right"
                      text
                      onClick={() => navigate(`/analysis/${event.id}`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <DataTable
        value={mockEvents}
        selection={selectedEvent}
        onSelectionChange={(e) => setSelectedEvent(e.value)}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sortMode="multiple"
        removableSort
        filterDisplay="menu"
        className="mt-4"
      >
        <Column field="title" header="Title" sortable filter />
        <Column field="type" header="Type" body={typeBodyTemplate} sortable filter />
        <Column field="location" header="Location" sortable filter />
        <Column
          field="timestamp"
          header="Timestamp"
          body={timestampBodyTemplate}
          sortable
        />
        <Column
          field="severity"
          header="Severity"
          body={severityBodyTemplate}
          sortable
          filter
        />
        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          sortable
          filter
        />
        <Column body={actionBodyTemplate} />
      </DataTable>
  )
}