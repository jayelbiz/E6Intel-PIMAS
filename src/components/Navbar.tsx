import { useNavigate, useLocation } from 'react-router-dom'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-line',
      command: () => navigate('/dashboard')
    },
    {
      label: 'Map',
      icon: 'pi pi-map',
      command: () => navigate('/map')
    },
    {
      label: 'Reports',
      icon: 'pi pi-file',
      command: () => navigate('/analysis')
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => navigate('/settings')
    }
  ]

  const start = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate('/')}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          location.pathname === '/' ? "bg-primary/10" : "hover:bg-surface-hover"
        )}
      >
        <i className="pi pi-shield text-xl text-primary" />
        <span className="font-medium hidden sm:inline">E6:12 Intel</span>
      </button>
    </div>
  )

  const end = (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <Button
        icon={theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'}
        onClick={toggleTheme}
        text
        rounded
        size="small"
        tooltip={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        tooltipOptions={{ position: 'bottom' }}
      />

      {/* User Menu */}
      <Avatar
        icon="pi pi-user"
        size="small"
        shape="circle"
        className="cursor-pointer"
        onClick={() => navigate('/settings/account')}
      />
    </div>
  )

  return (
    <Menubar
      model={menuItems}
      start={start}
      end={end}
      className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border h-12"
      pt={{
        root: { className: 'bg-surface-card px-4' },
        button: { className: 'h-12' },
        menuitem: { className: 'h-12' }
      }}
    />
  )
}