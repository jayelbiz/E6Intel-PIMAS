import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Card } from '@/components/ui/card'

export function MapTimelinePage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Event Timeline"
        description="Historical and predictive AI trend timeline"
      />
      <Card>
        <Card.Header>
          <Card.Title>Timeline View</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Event timeline coming soon...</p>
        </Card.Content>
      </Card>
    </Container>
  )
}