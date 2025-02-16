import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menubar } from 'primereact/menubar'

const MainLayout = () => {
  const navigate = useNavigate()

  const menuItems = [
    {
      label: 'News',
      icon: 'pi pi-globe',
      command: () => navigate('/')
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => navigate('/settings')
    }
  ]

  return (
    <div className="min-h-screen flex flex-column surface-ground">
      <Menubar 
        model={menuItems} 
        className="border-noround surface-card"
        start={() => (
          <div className="flex align-items-center gap-2">
            <i className="pi pi-shield text-2xl text-primary"></i>
            <span className="text-xl font-bold">E6Intel PIMAS</span>
          </div>
        )}
      />
      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
