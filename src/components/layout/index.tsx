import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="surface-ground min-h-screen">
      <Navbar />
      <main className="pt-4">
        <Outlet />
      </main>
    </div>
  )
}