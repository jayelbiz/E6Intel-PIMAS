import { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { ProgressSpinner } from 'primereact/progressspinner'
import { checkApiConnections } from '@/lib/api/diagnostics'

interface ApiStatus {
  name: string
  status: 'connected' | 'error' | 'missing_config'
  error?: string
}

const statusConfig = {
  connected: { severity: 'success', icon: 'pi pi-check' },
  error: { severity: 'danger', icon: 'pi pi-times' },
  missing_config: { severity: 'warning', icon: 'pi pi-exclamation-triangle' }
}

export function ApiStatus() {
  const [statuses, setStatuses] = useState<ApiStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      try {
        const results = await checkApiConnections()
        setStatuses(results)
      } catch (error) {
        console.error('Error checking API status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-content-center">
        <ProgressSpinner />
      </div>
    )
  }

  return (
    <Card title="API Status" className="mb-4">
      <div className="flex flex-column gap-3">
        {statuses.map((status) => (
          <div
            key={status.name}
            className="flex align-items-center justify-content-between p-3 surface-ground border-round"
          >
            <span className="font-medium">{status.name}</span>
            <div className="flex align-items-center gap-2">
              <Tag
                value={status.status}
                icon={statusConfig[status.status].icon}
                severity={statusConfig[status.status].severity as any}
              />
              {status.error && (
                <span className="text-sm text-600">
                  ({status.error})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}