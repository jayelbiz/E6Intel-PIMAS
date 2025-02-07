import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

export function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-ground">
      <Container className="max-w-md">
        <Card>
          <Card.Header className="text-center">
            <i className="pi pi-lock text-4xl text-primary mb-2" />
            <Card.Title>Reset Password</Card.Title>
            <Card.Description>
              Enter your email to reset your password
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <span className="p-input-icon-left w-full">
                  <i className="pi pi-envelope" />
                  <InputText
                    type="email"
                    placeholder="Enter your email"
                    className="w-full"
                  />
                </span>
              </div>
              <Button
                label="Reset Password"
                icon="pi pi-lock"
                className="w-full"
              />
            </form>
          </Card.Content>
        </Card>
      </Container>
    </div>
  )
}