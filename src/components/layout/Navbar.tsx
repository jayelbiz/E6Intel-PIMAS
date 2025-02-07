import { useNavigate } from 'react-router-dom'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'

export function Navbar() {
  const navigate = useNavigate()

  const menuItems = [
    {
      label: 'News',
      icon: 'pi pi-globe',
      command: () => navigate('/news')
    },
    {
      label: 'Analysis',
      icon: 'pi pi-chart-line',
      command: () => navigate('/analysis')
    }
  ]

  const start = (
    <div className="flex items-center gap-2">
      <i className="pi pi-shield text-xl text-primary" />
      <span className="font-medium">E6:12 Intel</span>
    </div>
  )

  const end = (
    <div className="flex gap-2">
      <Button
        label="Submit Report"
        icon="pi pi-plus"
        onClick={() => navigate('/submit')}
      />
    </div>
  )

  return (
    <Menubar
      model={menuItems}
      start={start}
      end={end}
      className="surface-card border-bottom-1 surface-border"
    />
  )
}