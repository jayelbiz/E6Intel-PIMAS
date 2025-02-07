import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { GlobalEvents } from '@/components/events/GlobalEvents'

export function EventsPage() {
  return (
    <Container className="py-4">
      <GlobalEvents />
    </Container>
  )
}