import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-ground">
      <Container className="max-w-md">
        <Card>
          <Card.Header className="text-center">
            <i className="pi pi-shield text-4xl text-primary mb-2" />
            <Card.Title>Welcome Back</Card.Title>
            <Card.Description>
              Sign in to access E6:12 Intel
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
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Password
                  placeholder="Enter your password"
                  toggleMask
                  className="w-full"
                  inputClassName="w-full"
                />
              </div>
              <Button
                label="Sign In"
                icon="pi pi-sign-in"
                className="w-full"
              />
            </form>
          </Card.Content>
        </Card>
      </Container>
    </div>
  )
}