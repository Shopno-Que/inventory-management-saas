import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-primary">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <NavLink to="/products" className={({ isActive }) =>
            `nav-link ${isActive ? 'text-primary font-semibold' : ''}`
          }>Products</NavLink>
          {/* Other nav links */}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-bg-body">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
