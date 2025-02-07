import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-ground">
      <Container className="max-w-lg">
        <Card className="text-center">
          <div className="text-6xl text-primary mb-4">
            <i className="pi pi-exclamation-circle"></i>
          </div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl text-text-color-secondary mb-6">
            The page you're looking for couldn't be found.
          </p>
          <div className="flex justify-center gap-2">
            <Button
              label="Go Home"
              icon="pi pi-home"
              onClick={() => navigate('/')}
            />
            <Button
              label="Go Back"
              icon="pi pi-arrow-left"
              severity="secondary"
              onClick={() => navigate(-1)}
            />
          </div>
        </Card>
      </Container>
    </div>
  )
}