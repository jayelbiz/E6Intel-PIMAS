import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { TrendingKeywords } from '@/components/dashboard/TrendingKeywords'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" id="home-page">
      {/* Hero Section */}
      <section className="relative surface-ground pt-8 pb-8">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <i className="pi pi-shield text-6xl mb-4 text-primary"></i>
            <h1 className="text-5xl font-bold mb-4 text-primary">
              E6:12 Intel - PIMAS
            </h1>
            <p className="text-xl mb-4 text-color-secondary">
              AI-Driven Prophetic Intelligence System for analyzing global events through a biblical lens
            </p>
            <div className="flex flex-column sm:flex-row align-items-center justify-content-center gap-3">
              <Button 
                id="dashboard-cta"
                label="View Dashboard" 
                icon="pi pi-chart-line"
                onClick={() => navigate('/dashboard')}
                size="large"
              />
              <Button
                id="map-cta"
                label="Explore Map"
                icon="pi pi-map"
                onClick={() => navigate('/map')}
                severity="secondary"
                size="large"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Search Section */}
      <section className="py-4 relative -mt-4">
        <Container>
          <Card className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <span className="p-input-icon-left flex-1">
                <i className="pi pi-search"></i>
                <InputText 
                  id="global-search"
                  placeholder="Search events, locations, or keywords..." 
                  className="w-full"
                />
              </span>
              <Button id="search-submit" icon="pi pi-search" />
            </div>
          </Card>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-6 surface-section">
        <Container>
          <div className="grid">
            <div className="col-12 md:col-4">
              <FeatureCard
                id="analysis-feature"
                icon="pi pi-chart-bar"
                title="AI Analysis"
                description="Advanced AI analysis of news, media narratives, and global events through a biblical perspective"
              />
            </div>
            <div className="col-12 md:col-4">
              <FeatureCard
                id="mapping-feature"
                icon="pi pi-map"
                title="Geolocation Mapping"
                description="Interactive mapping of prophetic events and patterns worldwide"
              />
            </div>
            <div className="col-12 md:col-4">
              <FeatureCard
                id="alerts-feature"
                icon="pi pi-exclamation-triangle"
                title="Early Warning"
                description="Real-time alerts and notifications for significant prophetic developments"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Live Trends Panel */}
      <section className="py-6">
        <Container>
          <div className="grid">
            <div className="col-12 md:col-6">
              <h2 className="text-2xl font-bold mb-3">Live Intelligence Trends</h2>
              <p className="text-color-secondary mb-4">
                Track real-time patterns in global events, deception detection, and prophetic alignments.
              </p>
              <Button 
                id="analysis-cta"
                label="View Full Analysis" 
                icon="pi pi-arrow-right"
                onClick={() => navigate('/analysis')}
                text
              />
            </div>
            <div className="col-12 md:col-6">
              <Card>
                <TrendingKeywords />
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

function FeatureCard({ 
  id,
  icon, 
  title, 
  description 
}: { 
  id: string
  icon: string
  title: string
  description: string 
}) {
  return (
    <Card id={id} className="text-center">
      <div className="inline-flex align-items-center justify-content-center w-4rem h-4rem border-circle bg-primary-100 text-primary mb-3">
        <i className={`${icon} text-3xl`}></i>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-color-secondary">{description}</p>
    </Card>
  )
}