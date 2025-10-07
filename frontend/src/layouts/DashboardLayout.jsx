import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import PageTransition from '../components/ui/PageTransition.jsx'
import BotaoVoltarHome from '../components/BotaoVoltarHome.jsx'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <BotaoVoltarHome />
      <Navbar />
      <main className="max-w-7xl mx-auto p-4">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  )
}
