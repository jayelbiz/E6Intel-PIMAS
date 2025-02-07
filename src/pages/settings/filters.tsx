import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Card } from '@/components/ui/card'

export function FilterSettingsPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Filter Settings"
        description="Configure event filtering preferences"
      />
      <Card>
        <Card.Header>
          <Card.Title>Filter Settings</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Filter settings coming soon...</p>
        </Card.Content>
      </Card>
    </Container>
  )
}