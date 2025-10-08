import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar fixa (desktop) + gaveta (mobile) */}
      <Sidebar aberto={mobileOpen} onFechar={() => setMobileOpen(false)} />

      {/* Topbar da área logada */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 md:pl-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/dashboard" className="font-semibold text-emerald-600 dark:text-emerald-400">
            MoneyMapp TCC
          </Link>
          <span className="text-sm text-gray-500 dark:text-gray-400">• Área logada</span>
        </div>
      </header>

      {/* Conteúdo: padding-left fixo no desktop para não sumir nada */}
      <main className="md:pl-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
