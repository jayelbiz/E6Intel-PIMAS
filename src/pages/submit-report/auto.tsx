import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Card } from '@/components/ui/card'

export function AutoSubmissionPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Automated Report Submission"
        description="AI-assisted report generation with auto data extraction"
      />
      <Card>
        <Card.Header>
          <Card.Title>Automated Report Form</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Automated report submission form coming soon...</p>
        </Card.Content>
      </Card>
    </Container>
  )
}