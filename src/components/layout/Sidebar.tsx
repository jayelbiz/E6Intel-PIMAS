import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Sidebar as PrimeSidebar } from 'primereact/sidebar'
import { Divider } from 'primereact/divider'

const navigationItems = [
  {
    section: 'Intelligence',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'pi pi-chart-line',
        path: '/dashboard',
        description: 'AI-categorized news and trends',
        items: [
          { label: 'Trending', path: '/dashboard/trending', icon: 'pi pi-chart-bar' },
          { label: 'Social Monitoring', path: '/dashboard/social-monitoring', icon: 'pi pi-globe' },
          { label: 'Prophetic Signals', path: '/dashboard/prophetic-signals', icon: 'pi pi-bolt' },
          { label: 'Deception Detection', path: '/dashboard/deception-detection', icon: 'pi pi-shield' }
        ]
      },
      {
        id: 'map',
        label: 'Interactive Map',
        icon: 'pi pi-map',
        path: '/map',
        description: 'Geospatial intelligence view',
        items: [
          { label: 'Events', path: '/map/events', icon: 'pi pi-calendar' },
          { label: 'Layers', path: '/map/layers', icon: 'pi pi-clone' },
          { label: 'Timeline', path: '/map/timeline', icon: 'pi pi-clock' }
        ]
      }
    ]
  },
  {
    section: 'Analysis',
    items: [
      {
        id: 'analysis',
        label: 'Analysis Portal',
        icon: 'pi pi-file',
        path: '/analysis',
        description: 'Detailed event analysis',
        items: [
          { label: 'Sentiment', path: '/analysis/sentiment', icon: 'pi pi-chart-pie' },
          { label: 'Prophecy Correlation', path: '/analysis/prophecy-correlation', icon: 'pi pi-sitemap' },
          { label: 'Media Control', path: '/analysis/media-control', icon: 'pi pi-globe' }
        ]
      },
      {
        id: 'submit',
        label: 'Submit Report',
        icon: 'pi pi-send',
        path: '/submit-report',
        description: 'Report new intelligence',
        items: [
          { label: 'Manual Report', path: '/submit-report/manual', icon: 'pi pi-file-edit' },
          { label: 'Auto Analysis', path: '/submit-report/auto', icon: 'pi pi-cog' }
        ]
      }
    ]
  },
  {
    section: 'Settings',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        icon: 'pi pi-cog',
        path: '/settings',
        description: 'Customize your experience',
        items: [
          { label: 'Account', path: '/settings/account', icon: 'pi pi-user' },
          { label: 'Alerts', path: '/settings/alerts', icon: 'pi pi-bell' },
          { label: 'Filters', path: '/settings/filters', icon: 'pi pi-filter' }
        ]
      }
    ]
  }
]

export function Sidebar() {
  const [visible, setVisible] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleSidebar = () => setVisible(!visible)

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        icon="pi pi-bars"
        onClick={toggleSidebar}
        className="fixed left-4 top-14 lg:hidden z-5"
        rounded
        text
      />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-12 h-[calc(100vh-3rem)] w-16rem surface-card border-right-1 surface-border overflow-y-auto">
        <SidebarContent location={location} navigate={navigate} onSelect={() => null} />
      </div>
      
      {/* Mobile Sidebar */}
      <PrimeSidebar
        visible={visible}
        onHide={() => setVisible(false)}
        className="p-0 top-12"
        style={{ height: 'calc(100vh - 3rem)' }}
        position="left"
        showCloseIcon={false}
        modal={false}
        dismissable
      >
        <SidebarContent 
          location={location} 
          navigate={navigate} 
          onSelect={() => setVisible(false)} 
        />
      </PrimeSidebar>
    </>
  )
}

interface SidebarContentProps {
  location: { pathname: string }
  navigate: (path: string) => void
  onSelect: () => void
}

function SidebarContent({ location, navigate, onSelect }: SidebarContentProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const handleNavigate = (path: string) => {
    navigate(path)
    onSelect()
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="p-3">
      {navigationItems.map(({ section, items }) => (
        <div key={section} className="mb-3">
          <div className="px-3 mb-2">
            <span className="text-xs font-medium text-color-secondary uppercase">
              {section}
            </span>
          </div>
          <div className="flex flex-column gap-1">
            {items.map((item) => (
              <div key={item.id}>
                <Button
                  icon={item.icon}
                  label={item.label}
                  onClick={() => item.items ? toggleExpanded(item.id) : handleNavigate(item.path)}
                  text
                  size="small"
                  className="w-full justify-content-start"
                  severity={location.pathname === item.path ? 'primary' : 'secondary'}
                  tooltip={item.description}
                  tooltipOptions={{
                    position: 'right',
                    showDelay: 1000,
                    className: 'text-xs'
                  }}
                  badge={item.items?.length.toString()}
                  badgeClassName={expandedItems[item.id] ? 'hidden' : ''}
                />
                
                {item.items && expandedItems[item.id] && (
                  <div className="ml-4 mt-1">
                    {item.items.map((subItem) => (
                      <Button
                        key={subItem.path}
                        icon={subItem.icon}
                        label={subItem.label}
                        onClick={() => handleNavigate(subItem.path)}
                        text
                        size="small"
                        className="w-full justify-content-start"
                        severity={location.pathname === subItem.path ? 'primary' : 'secondary'}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <Divider className="my-3" />
        </div>
      ))}
    </div>
  )
}