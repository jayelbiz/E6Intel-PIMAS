import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Card } from '@/components/ui/card'

export function AccountSettingsPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Account Settings"
        description="Manage your account preferences"
      />
      <Card>
        <Card.Header>
          <Card.Title>Account Settings</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Account settings coming soon...</p>
        </Card.Content>
      </Card>
    </Container>
  )
}