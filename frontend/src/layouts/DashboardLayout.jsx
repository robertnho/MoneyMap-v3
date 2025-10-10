import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex h-screen w-screen bg-gradient-to-br from-sky-200 via-indigo-200 to-blue-300 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 overflow-hidden">
      {/* Sidebar fixa (desktop) + gaveta (mobile) */}
      <Sidebar aberto={mobileOpen} onFechar={() => setMobileOpen(false)} />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 h-full md:ml-20">
        {/* Topbar */}
        <header className="flex-shrink-0 z-20 bg-white/60 dark:bg-gray-800/70 backdrop-blur border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              to="/dashboard"
              className="font-semibold text-indigo-600 dark:text-indigo-400 text-lg tracking-wide"
            >
              MoneyMapp TCC
            </Link>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              • Área logada
            </span>
          </div>
        </header>

        {/* Conteúdo da página (dashboard) */}
        <main className="flex-1 overflow-y-auto h-full p-2 md:p-4">
          <div className="h-full w-full bg-white/70 dark:bg-zinc-900/70 rounded-2xl shadow-lg backdrop-blur-sm p-3 md:p-4 border border-white/20 dark:border-zinc-700">
            <div className="min-h-full flex flex-col justify-start">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
