import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Card } from '@/components/ui/card'

export function SocialMonitoringPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Social Media Monitoring"
        description="OSINT feed from Twitter/Telegram and other social platforms"
      />
      <Card>
        <Card.Header>
          <Card.Title>Social Media Feed</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>Social media monitoring feed coming soon...</p>
        </Card.Content>
      </Card>
    </Container>
  )
}