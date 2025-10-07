// src/layouts/PublicLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import PageTransition from '../components/ui/PageTransition.jsx'

export default function PublicLayout() {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  )
}
