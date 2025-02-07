import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { TrendingKeywords } from '@/components/dashboard/TrendingKeywords'

export function TrendingPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Trending Analysis"
        description="Real-time trends and patterns in prophetic events"
      />
      <TrendingKeywords />
    </Container>
  )
}