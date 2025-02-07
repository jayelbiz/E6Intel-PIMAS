import { useState, useEffect } from 'react'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/ui/page-header'
import { Card } from '@/components/ui/card'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useNavigate } from 'react-router-dom'
import { fetchNews, type NewsItem } from '@/lib/api/news'

const typeConfig = {
  prophecy: { icon: 'pi pi-exclamation-triangle', severity: 'info' },
  disaster: { icon: 'pi pi-cloud', severity: 'danger' },
  miracle: { icon: 'pi pi-star', severity: 'success' },
  endTimes: { icon: 'pi pi-clock', severity: 'warning' }
}

export function NewsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState<NewsItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await fetchNews()
        setNews(data)
      } catch (err) {
        setError('Failed to load news')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  if (loading) {
    return (
      <Container className="py-4">
        <div className="flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <ProgressSpinner />
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-4">
        <Card>
          <div className="text-center p-5">
            <i className="pi pi-exclamation-triangle text-5xl text-yellow-500 mb-3"></i>
            <h3 className="m-0">{error}</h3>
            <Button
              label="Try Again"
              icon="pi pi-refresh"
              className="mt-3"
              onClick={() => window.location.reload()}
            />
          </div>
        </Card>
      </Container>
    )
  }

  const featuredNews = news.slice(0, 3)
  const recentNews = news.slice(3, 5)

  return (
    <Container className="py-4">
      <PageHeader
        title="Prophetic Intelligence News"
        description="AI-analyzed news and events through a biblical lens"
      >
        <div className="flex gap-2">
          <Button
            label="View Map"
            icon="pi pi-map"
            onClick={() => navigate('/map')}
          />
          <Button
            label="Submit News"
            icon="pi pi-plus"
            severity="secondary"
            onClick={() => navigate('/submit-report')}
          />
        </div>
      </PageHeader>

      <div className="grid">
        {/* Featured News */}
        <div className="col-12 lg:col-8">
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Featured Stories</Card.Title>
            </Card.Header>
            <div className="grid">
              {featuredNews.map((item, index) => (
                <div key={item.id} className={index === 0 ? 'col-12' : 'col-12 lg:col-6'}>
                  <div 
                    className="relative overflow-hidden border-round mb-3 cursor-pointer"
                    style={{ height: index === 0 ? '400px' : '200px' }}
                    onClick={() => navigate(`/news/${item.id}`)}
                  >
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/800x400?text=News+Image';
                        }}
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black-alpha-70">
                      <div className="flex gap-2 mb-2">
                        <Tag
                          value={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          icon={typeConfig[item.type].icon}
                          severity={typeConfig[item.type].severity as any}
                        />
                        <Tag
                          value={item.source}
                          icon="pi pi-globe"
                          severity="secondary"
                        />
                      </div>
                      <h3 className="text-white m-0 font-medium">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent News Sidebar */}
        <div className="col-12 lg:col-4">
          <Card>
            <Card.Header>
              <Card.Title>Recent Updates</Card.Title>
            </Card.Header>
            <div className="flex flex-column gap-3">
              {recentNews.map(item => (
                <div 
                  key={item.id}
                  className="cursor-pointer hover:surface-hover border-round p-3"
                  onClick={() => navigate(`/news/${item.id}`)}
                >
                  <div className="flex gap-2 mb-2">
                    <Tag
                      value={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      icon={typeConfig[item.type].icon}
                      severity={typeConfig[item.type].severity as any}
                    />
                    <Tag
                      value={item.timestamp}
                      icon="pi pi-clock"
                      severity="secondary"
                    />
                  </div>
                  <h4 className="m-0 mb-2">{item.title}</h4>
                  <p className="text-color-secondary m-0 text-sm">
                    {item.summary}
                  </p>
                  <div className="flex justify-content-between align-items-center mt-3">
                    <span className="text-sm text-color-secondary">
                      {item.source}
                    </span>
                    <Button
                      label="Read More"
                      icon="pi pi-arrow-right"
                      text
                      size="small"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}