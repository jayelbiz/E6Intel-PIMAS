import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'

interface Analysis {
  id: string
  title: string
  type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
  source: string
  confidence: number
  timestamp: string
  status: 'pending' | 'processing' | 'completed'
  summary: string
}

const mockAnalyses: Analysis[] = [
  {
    id: '1',
    title: 'Unusual Celestial Phenomena Over Jerusalem',
    type: 'prophecy',
    source: 'Jerusalem Post',
    confidence: 0.89,
    timestamp: '2024-02-15T10:30:00Z',
    status: 'completed',
    summary: 'Multiple witnesses report unprecedented astronomical events...'
  },
  {
    id: '2',
    title: 'Ancient Manuscript Discovery in Qumran',
    type: 'miracle',
    source: 'Biblical Archaeology Review',
    confidence: 0.95,
    timestamp: '2024-02-14T15:45:00Z',
    status: 'completed',
    summary: 'New Dead Sea Scroll fragments reveal prophetic content...'
  },
  {
    id: '3',
    title: 'Global Weather Pattern Anomalies',
    type: 'disaster',
    source: 'Reuters',
    confidence: 0.78,
    timestamp: '2024-02-13T08:15:00Z',
    status: 'processing',
    summary: 'Unprecedented weather events affecting multiple regions...'
  }
]

const typeConfig = {
  prophecy: { icon: 'pi pi-exclamation-triangle', severity: 'info' },
  disaster: { icon: 'pi pi-cloud', severity: 'danger' },
  miracle: { icon: 'pi pi-star', severity: 'success' },
  endTimes: { icon: 'pi pi-clock', severity: 'warning' }
}

const statusConfig = {
  pending: { icon: 'pi pi-clock', severity: 'warning' },
  processing: { icon: 'pi pi-spin pi-spinner', severity: 'info' },
  completed: { icon: 'pi pi-check', severity: 'success' }
}

export function AnalysisPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const navigate = useNavigate()

  const typeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Prophecy', value: 'prophecy' },
    { label: 'Disaster', value: 'disaster' },
    { label: 'Miracle', value: 'miracle' },
    { label: 'End Times', value: 'endTimes' }
  ]

  const typeBodyTemplate = (rowData: Analysis) => (
    <Tag
      value={rowData.type.charAt(0).toUpperCase() + rowData.type.slice(1)}
      icon={typeConfig[rowData.type].icon}
      severity={typeConfig[rowData.type].severity as any}
    />
  )

  const confidenceBodyTemplate = (rowData: Analysis) => (
    <div className="flex align-items-center gap-2">
      <div className="w-full surface-border border-round h-2rem">
        <div
          className="h-full border-round bg-primary"
          style={{ width: `${rowData.confidence * 100}%` }}
        />
      </div>
      <span className="text-sm whitespace-nowrap">
        {Math.round(rowData.confidence * 100)}%
      </span>
    </div>
  )

  const statusBodyTemplate = (rowData: Analysis) => (
    <Tag
      value={rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}
      icon={statusConfig[rowData.status].icon}
      severity={statusConfig[rowData.status].severity as any}
    />
  )

  const actionBodyTemplate = (rowData: Analysis) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-eye"
        text
        size="small"
        onClick={() => navigate(`/analysis/${rowData.id}`)}
        tooltip="View Details"
      />
      <Button
        icon="pi pi-file-export"
        text
        size="small"
        tooltip="Export Report"
      />
    </div>
  )

  return (
    <Container className="py-4">
      <PageHeader
        title="Analysis Portal"
        description="AI-powered analysis of prophetic and significant events"
      >
        <div className="flex gap-2">
          <Button
            label="Submit URL"
            icon="pi pi-link"
            onClick={() => navigate('/submit-report')}
          />
          <Button
            label="Batch Analysis"
            icon="pi pi-upload"
            severity="secondary"
          />
        </div>
      </PageHeader>

      <Card>
        <Card.Header>
          <div className="flex align-items-center gap-4">
            <span className="p-input-icon-left flex-1">
              <i className="pi pi-search" />
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search analyses..."
                className="w-full"
              />
            </span>
            <Dropdown
              value={selectedType}
              onChange={(e) => setSelectedType(e.value)}
              options={typeOptions}
              className="w-12rem"
            />
          </div>
        </Card.Header>

        <DataTable
          value={mockAnalyses}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          sortMode="multiple"
          removableSort
          className="mt-4"
        >
          <Column field="title" header="Title" sortable />
          <Column field="type" header="Type" body={typeBodyTemplate} sortable />
          <Column field="source" header="Source" sortable />
          <Column
            field="confidence"
            header="Confidence"
            body={confidenceBodyTemplate}
            sortable
          />
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
          />
          <Column
            field="timestamp"
            header="Date"
            sortable
            body={(rowData) => new Date(rowData.timestamp).toLocaleDateString()}
          />
          <Column body={actionBodyTemplate} />
        </DataTable>
      </Card>
    </Container>
  )
}