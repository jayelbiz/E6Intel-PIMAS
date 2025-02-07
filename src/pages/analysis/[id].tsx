import { useParams } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { Chart } from 'primereact/chart'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'

const mockAnalysis = {
  id: '1',
  title: 'Unusual Celestial Phenomena Over Jerusalem',
  type: 'prophecy',
  source: 'Jerusalem Post',
  url: 'https://example.com/article',
  confidence: 0.89,
  timestamp: '2024-02-15T10:30:00Z',
  status: 'completed',
  summary: 'Multiple witnesses report unprecedented astronomical events visible over Jerusalem, sparking discussions about prophetic significance.',
  keywords: ['celestial', 'prophecy', 'Jerusalem', 'signs', 'witnesses'],
  metrics: {
    influence: 0.85,
    reach: 0.92,
    biblicalAlignment: 0.88,
    narrativeControl: 0.76
  },
  relatedScriptures: [
    { reference: 'Joel 2:30', text: 'I will show wonders in the heavens...' },
    { reference: 'Luke 21:11', text: 'There will be great signs from heaven...' },
    { reference: 'Acts 2:19', text: 'I will show wonders in the heaven above...' }
  ]
}

const typeConfig = {
  prophecy: { icon: 'pi pi-exclamation-triangle', severity: 'info' },
  disaster: { icon: 'pi pi-cloud', severity: 'danger' },
  miracle: { icon: 'pi pi-star', severity: 'success' },
  endTimes: { icon: 'pi pi-clock', severity: 'warning' }
}

export function AnalysisDetailPage() {
  const { id } = useParams()

  const metricsData = {
    labels: ['Influence', 'Reach', 'Biblical Alignment', 'Narrative Control'],
    datasets: [
      {
        label: 'Analysis Metrics',
        data: [
          mockAnalysis.metrics.influence * 100,
          mockAnalysis.metrics.reach * 100,
          mockAnalysis.metrics.biblicalAlignment * 100,
          mockAnalysis.metrics.narrativeControl * 100
        ],
        backgroundColor: 'rgba(var(--primary-color), 0.2)',
        borderColor: 'rgb(var(--primary-color))',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(var(--primary-color))',
      }
    ]
  }

  const metricsOptions = {
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        grid: {
          color: 'rgba(var(--surface-border), 0.2)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return (
    <Container className="py-8">
      <PageHeader
        title="Analysis Details"
        description="Comprehensive analysis results and insights"
      >
        <div className="flex gap-2">
          <Button
            label="Export Report"
            icon="pi pi-file-export"
          />
          <Button
            label="Share"
            icon="pi pi-share-alt"
            severity="secondary"
          />
        </div>
      </PageHeader>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Main Analysis Card */}
          <Card>
            <Card.Header>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag
                    value={mockAnalysis.type.charAt(0).toUpperCase() + mockAnalysis.type.slice(1)}
                    icon={typeConfig[mockAnalysis.type as keyof typeof typeConfig].icon}
                    severity={typeConfig[mockAnalysis.type as keyof typeof typeConfig].severity as any}
                  />
                  <Tag
                    value={new Date(mockAnalysis.timestamp).toLocaleDateString()}
                    icon="pi pi-calendar"
                    severity="secondary"
                  />
                </div>
                <h1 className="text-2xl font-bold">{mockAnalysis.title}</h1>
                <a
                  href={mockAnalysis.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {mockAnalysis.source}
                </a>
              </div>
            </Card.Header>
            <Card.Content>
              <p className="text-lg mb-4">{mockAnalysis.summary}</p>
              <div className="flex flex-wrap gap-2">
                {mockAnalysis.keywords.map((keyword) => (
                  <Tag key={keyword} value={keyword} />
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Metrics Chart */}
          <Card>
            <Card.Header>
              <Card.Title>Analysis Metrics</Card.Title>
            </Card.Header>
            <Card.Content>
              <Chart
                type="radar"
                data={metricsData}
                options={metricsOptions}
                className="w-full max-w-xl mx-auto"
              />
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Confidence Score */}
          <Card>
            <Card.Header>
              <Card.Title>Confidence Score</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {Math.round(mockAnalysis.confidence * 100)}%
                </div>
                <p className="text-sm text-text-color-secondary">
                  Based on AI analysis and cross-referencing
                </p>
              </div>
            </Card.Content>
          </Card>

          {/* Related Scriptures */}
          <Card>
            <Card.Header>
              <Card.Title>Related Scriptures</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {mockAnalysis.relatedScriptures.map((scripture) => (
                  <div key={scripture.reference}>
                    <h4 className="font-medium mb-1">{scripture.reference}</h4>
                    <p className="text-sm text-text-color-secondary">
                      {scripture.text}
                    </p>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </Container>
  )
}