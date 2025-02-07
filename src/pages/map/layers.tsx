import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Card } from '@/components/ui/card'

export function MapLayersPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Map Layers"
        description="Toggle spiritual and geopolitical influence layers"
      />
      <Card>
        <Card.Header>
          <Card.Title>Map Layers</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Map layers control coming soon...</p>
        </Card.Content>
      </Card>
    </Container>
  )
}