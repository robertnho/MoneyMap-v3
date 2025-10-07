import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4">
        {/* 👇 sem isso, a página fica vazia */}
        <Outlet />
      </main>
    </div>
  )
}
