import { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { FileUpload } from 'primereact/fileupload'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'

const eventTypes = [
  { label: 'Prophecy', value: 'prophecy' },
  { label: 'Disaster', value: 'disaster' },
  { label: 'Miracle', value: 'miracle' },
  { label: 'End Times', value: 'endTimes' }
]

export function SubmitReportPage() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement submission logic
  }

  return (
    <Container className="py-8">
      <PageHeader
        title="Submit Report"
        description="Submit new intelligence for AI analysis"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* URL Submission */}
        <Card>
          <Card.Header>
            <Card.Title>URL Analysis</Card.Title>
            <Card.Description>
              Submit a URL for automated analysis
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Article URL
                </label>
                <span className="p-input-icon-left w-full">
                  <i className="pi pi-link" />
                  <InputText
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full"
                  />
                </span>
              </div>
              <Button
                type="submit"
                label="Analyze URL"
                icon="pi pi-search"
                className="w-full"
              />
            </form>
          </Card.Content>
        </Card>

        {/* Manual Report */}
        <Card>
          <Card.Header>
            <Card.Title>Manual Report</Card.Title>
            <Card.Description>
              Submit detailed information about an event
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Title
                </label>
                <InputText
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Type
                </label>
                <Dropdown
                  value={type}
                  onChange={(e) => setType(e.value)}
                  options={eventTypes}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <InputTextarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Supporting Evidence
                </label>
                <FileUpload
                  mode="basic"
                  name="evidence"
                  url="/api/upload"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  maxFileSize={10000000}
                  chooseLabel="Upload Files"
                />
              </div>
              <Button
                type="submit"
                label="Submit Report"
                icon="pi pi-send"
                className="w-full"
              />
            </form>
          </Card.Content>
        </Card>
      </div>
    </Container>
  )
}