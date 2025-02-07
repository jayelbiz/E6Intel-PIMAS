import { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { Card } from '@/components/ui/card'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'

interface FeedItem {
  id: string
  title: string
  source: 'news' | 'twitter' | 'telegram'
  type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
  timestamp: string
  content: string
  location?: string
  coordinates?: [number, number]
}

const mockFeed: FeedItem[] = [
  {
    id: '1',
    title: 'Unusual Celestial Event Reported',
    source: 'news',
    type: 'prophecy',
    timestamp: '10 minutes ago',
    content: 'Multiple witnesses report strange lights over Jerusalem',
    location: 'Jerusalem, Israel',
    coordinates: [31.7683, 35.2137]
  },
  {
    id: '2',
    title: 'Breaking: Temple Mount Activity',
    source: 'twitter',
    type: 'prophecy',
    timestamp: '15 minutes ago',
    content: 'Large gathering observed at Temple Mount #Jerusalem',
    location: 'Temple Mount',
    coordinates: [31.7781, 35.2360]
  },
  {
    id: '3',
    title: 'Weather Anomaly Alert',
    source: 'telegram',
    type: 'disaster',
    timestamp: '30 minutes ago',
    content: 'Unprecedented weather patterns detected across Mediterranean',
    location: 'Mediterranean Sea',
    coordinates: [34.5531, 18.0480]
  }
]

const sourceIcons = {
  news: 'pi pi-globe',
  twitter: 'pi pi-twitter',
  telegram: 'pi pi-send'
}

const typeConfig = {
  prophecy: { icon: 'pi pi-exclamation-triangle', severity: 'info' },
  disaster: { icon: 'pi pi-cloud', severity: 'danger' },
  miracle: { icon: 'pi pi-star', severity: 'success' },
  endTimes: { icon: 'pi pi-clock', severity: 'warning' }
}

interface NewsFeedProps {
  onItemClick?: (item: FeedItem) => void
}

export function NewsFeed({ onItemClick }: NewsFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const renderFeedItem = (item: FeedItem) => (
    <Card 
      key={item.id} 
      className="mb-2 cursor-pointer hover:surface-hover"
      onClick={() => onItemClick?.(item)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Tag
            value={item.source.toUpperCase()}
            icon={sourceIcons[item.source]}
            severity="secondary"
          />
          <Tag
            value={typeConfig[item.type].label}
            icon={typeConfig[item.type].icon}
            severity={typeConfig[item.type].severity as any}
          />
        </div>
        
        <h3 className="text-base font-medium m-0">{item.title}</h3>
        <p className="text-sm text-color-secondary m-0">{item.content}</p>
        
        <div className="flex items-center justify-between text-sm text-color-secondary">
          <span className="flex items-center gap-1">
            <i className="pi pi-clock" />
            {item.timestamp}
          </span>
          {item.location && (
            <span className="flex items-center gap-1">
              <i className="pi pi-map-marker" />
              {item.location}
            </span>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <TabView 
      activeIndex={activeIndex} 
      onTabChange={(e) => setActiveIndex(e.index)}
      className="h-full"
    >
      <TabPanel header="All" leftIcon="pi pi-list">
        <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
          {mockFeed.map(renderFeedItem)}
        </div>
      </TabPanel>
      <TabPanel header="News" leftIcon="pi pi-globe">
        <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
          {mockFeed.filter(item => item.source === 'news').map(renderFeedItem)}
        </div>
      </TabPanel>
      <TabPanel header="Social" leftIcon="pi pi-twitter">
        <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
          {mockFeed.filter(item => item.source === 'twitter').map(renderFeedItem)}
        </div>
      </TabPanel>
      <TabPanel header="Telegram" leftIcon="pi pi-send">
        <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
          {mockFeed.filter(item => item.source === 'telegram').map(renderFeedItem)}
        </div>
      </TabPanel>
    </TabView>
  )
}