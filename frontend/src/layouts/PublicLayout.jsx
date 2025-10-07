// src/layouts/PublicLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  // Nada de Navbar/Sidebar aqui
  return <Outlet />
}
