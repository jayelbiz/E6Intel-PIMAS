import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Card } from '@/components/ui/card'

export function ManualSubmissionPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Manual Report Submission"
        description="Submit detailed intelligence reports manually"
      />
      <Card>
        <Card.Header>
          <Card.Title>Manual Report Form</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Manual report submission form coming soon...</p>
        </Card.Content>
      </Card>
    </Container>
  )
}