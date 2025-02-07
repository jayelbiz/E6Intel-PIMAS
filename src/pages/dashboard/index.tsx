import { Card, Chart, Tag, Button } from '@/components/ui'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { TrendingKeywords } from '@/components/dashboard/TrendingKeywords'
import { EventCard } from '@/components/dashboard/EventCard'

const mockEvents = [
  {
    title: 'Unusual Celestial Event',
    type: 'prophecy',
    location: 'Jerusalem, Israel',
    timestamp: '2 hours ago',
    severity: 'high'
  },
  {
    title: 'Ancient Manuscript Discovery',
    type: 'miracle',
    location: 'Dead Sea Region',
    timestamp: '5 hours ago',
    severity: 'medium'
  },
  {
    title: 'Global Weather Anomaly',
    type: 'disaster',
    location: 'Mediterranean',
    timestamp: '1 day ago',
    severity: 'high'
  }
]

const activityData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Prophetic Events',
      data: [65, 59, 80, 81, 56, 55],
      fill: false,
      borderColor: 'var(--primary-color)',
      tension: 0.4
    },
    {
      label: 'Media Control',
      data: [28, 48, 40, 19, 86, 27],
      fill: false,
      borderColor: 'var(--yellow-500)',
      tension: 0.4
    }
  ]
}

const activityOptions = {
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const insightData = {
  labels: ['Prophecy', 'Disaster', 'Miracle', 'End Times'],
  datasets: [
    {
      data: [45, 25, 20, 10],
      backgroundColor: [
        'var(--primary-color)',
        'var(--red-500)',
        'var(--green-500)',
        'var(--yellow-500)'
      ]
    }
  ]
}

const insightOptions = {
  plugins: {
    legend: {
      position: 'right' as const
    }
  }
}

export function Dashboard() {
  return (
    <Container className="py-4">
      <PageHeader
        title="Intelligence Dashboard"
        description="Real-time prophetic intelligence and analysis"
      >
        <div className="flex gap-2">
          <Button
            label="Submit Report"
            icon="pi pi-plus"
            onClick={() => window.location.href = '/submit-report'}
          />
          <Button
            label="View Map"
            icon="pi pi-map"
            severity="secondary"
            onClick={() => window.location.href = '/map'}
          />
        </div>
      </PageHeader>

      <div className="grid">
        {/* Activity Chart */}
        <div className="col-12 lg:col-8">
          <Card>
            <div className="flex justify-content-between align-items-center mb-4">
              <h3 className="text-lg font-medium m-0">Activity Overview</h3>
              <Tag value="Live" icon="pi pi-clock" severity="info" />
            </div>
            <Chart type="line" data={activityData} options={activityOptions} />
          </Card>
        </div>

        {/* Event Distribution */}
        <div className="col-12 lg:col-4">
          <Card>
            <div className="flex justify-content-between align-items-center mb-4">
              <h3 className="text-lg font-medium m-0">Event Distribution</h3>
              <Button 
                icon="pi pi-filter" 
                text 
                rounded
                severity="secondary"
              />
            </div>
            <Chart type="pie" data={insightData} options={insightOptions} />
          </Card>
        </div>

        {/* Recent Events */}
        <div className="col-12 lg:col-8">
          <Card>
            <div className="flex justify-content-between align-items-center mb-4">
              <h3 className="text-lg font-medium m-0">Recent Events</h3>
              <Button
                label="View All"
                icon="pi pi-arrow-right"
                text
                onClick={() => window.location.href = '/map/events'}
              />
            </div>
            <div className="flex flex-column gap-2">
              {mockEvents.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </Card>
        </div>

        {/* Trending Keywords */}
        <div className="col-12 lg:col-4">
          <Card>
            <TrendingKeywords />
          </Card>
        </div>
      </div>
    </Container>
  )
}