import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { AlertPreferences } from '@/components/alerts/AlertPreferences'

export function AlertSettingsPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Alert Settings"
        description="Customize your alert preferences and notifications"
      />
      <AlertPreferences />
    </Container>
  )
}